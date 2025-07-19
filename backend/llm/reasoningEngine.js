const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createAnalysisPrompt } = require('./promptTemplates');
const { calculateConfidence } = require('./confidenceScoring');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Main reasoning function (existing)
async function generateReasonedResponse(userQuery, searchResults, analysisType = 'DOCUMENT_ANALYSIS') {
  try {
    if (!searchResults || searchResults.length === 0) {
      return {
        response: "I don't have enough relevant information in the uploaded documents to answer your question. Please upload more relevant documents or try rephrasing your question.",
        hasContent: false
      };
    }

    console.log(`[>] Generating Gemini response for: "${userQuery}"`);
    console.log(`[>] Using ${searchResults.length} document chunks for context`);

    const prompt = createAnalysisPrompt(userQuery, searchResults, analysisType);
    
    // Combine system and user prompts for Gemini
    const fullPrompt = `${prompt.system}\n\n${prompt.user}`;

    // Get Gemini model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1200,
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

// Smart query parser
async function parseAndEnhanceQuery(rawQuery) {
  try {
    console.log(`[>] Parsing query: "${rawQuery}"`);
    
    // Basic extraction using regex patterns
    const parsed = {
      demographics: {},
      policy: {},
      medical: {},
      intent: {},
      searchTerms: [],
      missing: []
    };

    // Extract age and gender
    const ageGenderMatch = rawQuery.match(/(\d{1,2})[MF]/i);
    if (ageGenderMatch) {
      parsed.demographics.age = ageGenderMatch[1];
      parsed.demographics.gender = ageGenderMatch[0].slice(-1).toUpperCase();
    }

    // Extract location
    const locationMatch = rawQuery.match(/\b(mumbai|delhi|bangalore|pune|chennai|kolkata|hyderabad|ahmedabad)\b/i);
    if (locationMatch) {
      parsed.demographics.location = locationMatch[1];
    }

    // Extract policy duration
    const policyMatch = rawQuery.match(/(\d+)[- ]?month/i);
    if (policyMatch) {
      parsed.policy.duration = `${policyMatch[1]} months`;
    }

    // Extract medical condition/procedure
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

    // Generate search terms
    parsed.searchTerms = [
      parsed.medical.condition,
      'eligibility',
      'coverage',
      'waiting period',
      parsed.demographics.location && `${parsed.demographics.location} network`
    ].filter(Boolean);

    // Identify missing information
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

// Enhanced search function
async function performEnhancedSearch(parsedQuery, searchResults) {
  // For now, just return the original search results
  // In a more advanced implementation, you could perform additional searches
  return searchResults;
}

// Generate structured decision
async function generateStructuredDecision(userQuery, searchResults, parsedQuery) {
  try {
    console.log(`[>] Generating structured decision for: "${userQuery}"`);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1000,
      }
    });

    const context = searchResults.slice(0, 5).map((result, index) => 
      `Document ${index + 1}: ${result.payload.fileName}
Content: ${result.payload.text.substring(0, 500)}...
Relevance: ${result.score?.toFixed(3)}`
    ).join('\n---\n');

    const prompt = `You are an insurance claim analyst. Analyze this query and provide a structured decision.

Query: "${userQuery}"
User Info: Age ${parsedQuery.demographics?.age || 'unknown'}, Gender ${parsedQuery.demographics?.gender || 'unknown'}, Location ${parsedQuery.demographics?.location || 'unknown'}
Medical: ${parsedQuery.medical?.condition || 'unknown'} treatment
Policy: ${parsedQuery.policy?.duration || 'unknown'} duration

Relevant Policy Documents:
${context}

Provide analysis in this format:

DECISION: [COVERED/NOT_COVERED/PARTIALLY_COVERED/INSUFFICIENT_INFO]
CONFIDENCE: [HIGH/MEDIUM/LOW]
SUMMARY: [Brief 1-2 sentence summary]

COVERAGE DETAILS:
- Eligible: [Yes/No/Unknown]
- Coverage Percentage: [0-100%]
- Maximum Amount: [Amount or N/A]

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

    // Parse the response into structured format
    const decision = {
      decision: {
        status: extractField(response, 'DECISION') || 'INSUFFICIENT_INFO',
        confidence: extractField(response, 'CONFIDENCE') || 'LOW',
        summary: extractField(response, 'SUMMARY') || response.substring(0, 200)
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
        immediate: ['Contact insurance provider', 'Gather required documents'],
        beforeTreatment: ['Get pre-authorization if required'],
        forClaim: ['Submit claim with all documents']
      }
    };

    console.log(`[✓] Structured decision generated`);
    return decision;

  } catch (error) {
    console.error('[x] Structured decision error:', error);
    return {
      decision: {
        status: 'INSUFFICIENT_INFO',
        confidence: 'LOW',
        summary: 'Unable to analyze due to processing error'
      }
    };
  }
}

// Helper function to extract fields from response text
function extractField(text, fieldName) {
  const regex = new RegExp(`${fieldName}:?\\s*(.+?)(?:\\n|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

// Document summarization
async function summarizeDocuments(documents) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 500,
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

// Claim eligibility analysis
async function analyzeClaimEligibility(userQuery, searchResults, userProfile = {}) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1200,
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
1. ELIGIBILITY STATUS (Eligible/Not Eligible/Insufficient Info)
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
