const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createAnalysisPrompt } = require('./promptTemplates');
const { calculateConfidence } = require('./confidenceScoring');
const { GEMINI_MODEL } = require('../config/aiConfig');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateReasonedResponse(userQuery, searchResults, analysisType = 'DOCUMENT_ANALYSIS', conversationHistory = []) {
  try {
    if (!searchResults || searchResults.length === 0) {
      return {
        response: "I don't have enough relevant information in the uploaded documents to answer your question. Please upload more relevant documents or try rephrasing your question.",
        hasContent: false
      };
    }

    console.log(`[>] Generating Gemini response for: "${userQuery}"`);
    console.log(`[>] Using ${searchResults.length} document chunks for context`);

    const prompt = createAnalysisPrompt(userQuery, searchResults, analysisType, conversationHistory);
    
    const fullPrompt = `${prompt.system}\n\n${prompt.user}`;

    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();
    
    console.log(`[✓] Gemini response generated (${response.length} characters)`);

    return {
      response,
      hasContent: true,
      usage: {
        promptTokens: fullPrompt.length / 4,
        completionTokens: response.length / 4,
        totalTokens: (fullPrompt.length + response.length) / 4
      }
    };

  } catch (error) {
    console.error('[x] Gemini reasoning error:', error);
    throw error;
  }
}

async function parseAndEnhanceQuery(rawQuery) {
  try {
    console.log(`[>] Parsing query: "${rawQuery}"`);
    
    const parsed = {
      demographics: {},
      policy: {},
      medical: {},
      intent: {},
      searchTerms: [],
      missing: []
    };

    const ageGenderMatch = rawQuery.match(/(\d{1,2})[MF]/i);
    if (ageGenderMatch) {
      parsed.demographics.age = ageGenderMatch[1];
      parsed.demographics.gender = ageGenderMatch[0].slice(-1).toUpperCase();
    }

    const locationMatch = rawQuery.match(/\b(mumbai|delhi|bangalore|pune|chennai|kolkata|hyderabad|ahmedabad)\b/i);
    if (locationMatch) {
      parsed.demographics.location = locationMatch[1];
    }

    const policyMatch = rawQuery.match(/(\d+)[- ]?month/i);
    if (policyMatch) {
      parsed.policy.duration = `${policyMatch[1]} months`;
    }

    const medicalTerms = [
      'surgery', 'treatment', 'maternity', 'diabetes', 'heart', 'knee', 'cancer',
      'accident', 'emergency', 'consultation', 'therapy', 'operation'
    ];
    
    for (const term of medicalTerms) {
      if (rawQuery.toLowerCase().includes(term)) {
        parsed.medical.condition = term;
        parsed.medical.treatmentType = term.includes('surgery') ? 'surgery' : 'treatment';
        break;
      }
    }

    parsed.searchTerms = [
      parsed.medical.condition,
      'eligibility',
      'coverage',
      'waiting period',
      parsed.demographics.location && `${parsed.demographics.location} network`
    ].filter(Boolean);

    if (!parsed.demographics.age) parsed.missing.push('age');
    if (!parsed.medical.condition) parsed.missing.push('medical condition');
    if (!parsed.policy.duration) parsed.missing.push('policy duration');

    console.log(`[✓] Query parsed:`, parsed);
    return parsed;

  } catch (error) {
    console.error('[x] Query parsing error:', error);
    return { demographics: {}, policy: {}, medical: {}, searchTerms: [] };
  }
}

async function performEnhancedSearch(parsedQuery, searchResults) {
  return searchResults;
}

async function generateStructuredDecision(userQuery, searchResults, parsedQuery, conversationHistory = []) {
  try {
    console.log(`[>] Generating structured decision for: "${userQuery}"`);

    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
      }
    });

    const context = searchResults.slice(0, 5).map((result, index) => 
      `Document ${index + 1}: ${result.payload.fileName}
Content: ${result.payload.text.substring(0, 500)}...
Relevance: ${result.score?.toFixed(3)}`
    ).join('\n---\n');

    let historyText = "";
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const formattedHistory = conversationHistory
        .filter(msg => msg && msg.content && (msg.type === 'user' || msg.type === 'ai'))
        .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      if (formattedHistory) {
        historyText = `PREVIOUS CONVERSATION HISTORY:\n${formattedHistory}\n\n`;
      }
    }

    const prompt = `You are an expert insurance claim analyst. Analyze this query and provide a structured decision.

${historyText}User Query: "${userQuery}"
User Info: Age ${parsedQuery.demographics?.age || 'unknown'}, Gender ${parsedQuery.demographics?.gender || 'unknown'}, Location ${parsedQuery.demographics?.location || 'unknown'}
Medical: ${parsedQuery.medical?.condition || 'unknown'} treatment (${parsedQuery.medical?.treatmentType || 'unknown'})
Policy: ${parsedQuery.policy?.duration || 'unknown'} duration

Relevant Policy Documents:
${context}

CRITICAL DECISION GUIDELINES:
1. If the user query or available facts do not contain enough specifics to verify critical policy conditions (e.g. policy tenure/duration for waiting period check, specific hospital network status, or pre-existing disease history), DO NOT immediately reject or mark as dead-end unsupported.
2. Instead, set DECISION to NEEDS_CLARIFICATION.
3. When DECISION is NEEDS_CLARIFICATION:
   - SUMMARY: State what the policy covers regarding this procedure and what condition is pending verification.
   - MISSING INFORMATION: List what specific details are missing from the user.
   - FOLLOW UP QUESTIONS: Provide 1 to 3 clear, concise questions for the user to answer in their next message.
4. If the query and context provide sufficient facts, set DECISION to COVERED, NOT_COVERED, or PARTIALLY_COVERED.

Provide analysis strictly in this format:

DECISION: [COVERED/NOT_COVERED/PARTIALLY_COVERED/NEEDS_CLARIFICATION]
CONFIDENCE: [HIGH/MEDIUM/LOW]
SUMMARY: [Brief 1-2 sentence summary]

COVERAGE DETAILS:
- Eligible: [Yes/No/Needs Clarification]
- Coverage Percentage: [0-100% or Not specified]
- Maximum Amount: [Amount or Not specified]

MISSING INFORMATION:
- [Item 1, or "None"]
- [Item 2]

FOLLOW UP QUESTIONS:
1. [Question 1, or "None"]
2. [Question 2]

REASONING:
- Primary factors affecting decision
- Relevant policy clauses (if any)
- Waiting periods or restrictions

REQUIREMENTS:
- Documents needed for claim
- Pre-authorization required: [Yes/No]
- Network hospital required: [Yes/No]

NEXT STEPS:
1. [Action 1]
2. [Action 2]
3. [Action 3]`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const rawDecision = extractField(response, 'DECISION') || '';
    let status = 'NEEDS_CLARIFICATION';
    if (/COVERED/i.test(rawDecision)) {
      if (/PARTIALLY/i.test(rawDecision)) status = 'PARTIALLY_COVERED';
      else if (/NOT/i.test(rawDecision)) status = 'NOT_COVERED';
      else status = 'COVERED';
    } else if (/NOT_COVERED/i.test(rawDecision)) {
      status = 'NOT_COVERED';
    } else if (/NEEDS_CLARIFICATION/i.test(rawDecision) || /INSUFFICIENT/i.test(rawDecision)) {
      status = 'NEEDS_CLARIFICATION';
    }

    const missingInfoRaw = extractListSection(response, 'MISSING INFORMATION');
    const followUpQuestions = extractNumberedSection(response, 'FOLLOW UP QUESTIONS');

    const decision = {
      decision: {
        status,
        confidence: extractField(response, 'CONFIDENCE') || 'MEDIUM',
        summary: extractField(response, 'SUMMARY') || response.substring(0, 200),
        missingInfo: missingInfoRaw.length > 0 ? missingInfoRaw : (parsedQuery.missing || []),
        followUpQuestions: followUpQuestions
      },
      coverage: {
        eligible: extractField(response, 'Eligible')?.toLowerCase().includes('yes') || false,
        coveragePercentage: parseInt(extractField(response, 'Coverage Percentage')) || 0,
        maxAmount: extractField(response, 'Maximum Amount') || null
      },
      reasoning: {
        primaryFactors: [response.includes('waiting') ? 'Waiting period consideration' : 'Standard coverage rules'],
        supportingClauses: []
      },
      requirements: {
        documentsNeeded: ['Policy documents', 'Medical reports'],
        preAuthorization: response.toLowerCase().includes('pre-authorization required: yes'),
        networkHospital: response.toLowerCase().includes('network hospital required: yes')
      },
      nextActions: {
        immediate: followUpQuestions.length > 0 ? followUpQuestions : ['Contact insurance provider', 'Gather required documents'],
        beforeTreatment: ['Get pre-authorization if required'],
        forClaim: ['Submit claim with all documents']
      }
    };

    console.log(`[✓] Structured decision generated (${status})`);
    return decision;

  } catch (error) {
    console.error('[x] Structured decision error:', error);
    return {
      decision: {
        status: 'ERROR',
        confidence: 'LOW',
        summary: `Unable to complete analysis: ${error.message || 'Processing error'}`
      },
      error: error.message
    };
  }
}

function extractField(text, fieldName) {
  const regex = new RegExp(`(?:#{1,6}\\s*)?(?:\\*\\*)?${fieldName}(?:\\*\\*)?:?\\s*\\n?\\*?\\*?([^\n*#]+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].replace(/^\*\*|\*\*$/g, '').trim() : null;
}

function extractListSection(text, sectionName) {
  const regex = new RegExp(`(?:#{1,6}\\s*)?(?:\\*\\*)?${sectionName}(?:\\*\\*)?:?\\s*\\n([\\s\\S]*?)(?=(?:\\n\\s*#{1,6}|\\n\\s*---|\\n\\s*\\*\\*[A-Z\\s]{3,}\\*\\*|$))`, 'i');
  const match = text.match(regex);
  if (!match) return [];
  return match[1]
    .split('\n')
    .map(line => line.replace(/^[#*•\d.\-\s]+/, '').replace(/\*\*/g, '').trim())
    .filter(line => line.length > 0 && !line.toLowerCase().includes('none'));
}

function extractNumberedSection(text, sectionName) {
  return extractListSection(text, sectionName);
}

async function summarizeDocuments(documents) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
      }
    });

    const documentSummaries = await Promise.all(
      documents.map(async (doc) => {
        const prompt = `Summarize this insurance document:

Document: ${doc.fileName}
Content: ${doc.chunks.join('\n\n').substring(0, 2000)}

Focus on:
1. Coverage details
2. Waiting periods
3. Exclusions
4. Claim procedures
5. Important terms

Provide a clear, structured summary:`;

        const result = await model.generateContent(prompt);
        
        return {
          fileName: doc.fileName,
          summary: result.response.text()
        };
      })
    );

    return documentSummaries;
  } catch (error) {
    console.error('[x] Document summarization error:', error);
    throw error;
  }
}

async function analyzeClaimEligibility(userQuery, searchResults, userProfile = {}) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
      }
    });

    const context = searchResults.map((result, index) => 
      `Document ${index + 1}: ${result.payload.fileName}
Content: ${result.payload.text}
Relevance: ${result.score?.toFixed(3)}`
    ).join('\n---\n');

    const prompt = `You are an expert insurance claim analyst. Analyze claim eligibility:

User Query: ${userQuery}
${userProfile.age ? `Age: ${userProfile.age}` : ''}
${userProfile.location ? `Location: ${userProfile.location}` : ''}
${userProfile.policyDuration ? `Policy Duration: ${userProfile.policyDuration}` : ''}

Policy Documents:
${context}

Provide comprehensive analysis with:
1. ELIGIBILITY STATUS (Eligible/Not Eligible/Needs Clarification)
2. DETAILED REASONING with policy citations
3. REQUIREMENTS and documents needed
4. LIMITATIONS and restrictions
5. NEXT STEPS for the user
6. CONFIDENCE LEVEL

Format clearly with headers for easy reading.`;

    const result = await model.generateContent(prompt);
    
    return {
      response: result.response.text(),
      hasContent: true,
      analysisType: 'claim_eligibility'
    };

  } catch (error) {
    console.error('[x] Claim eligibility analysis error:', error);
    throw error;
  }
}

module.exports = { 
  generateReasonedResponse, 
  summarizeDocuments,
  analyzeClaimEligibility,
  parseAndEnhanceQuery,
  performEnhancedSearch,
  generateStructuredDecision,
  calculateConfidence
};
