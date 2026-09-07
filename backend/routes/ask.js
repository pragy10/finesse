const express = require("express");
const router = express.Router();
const qdrantClient = require("../vector/qdrantClient");
const getEmbedding = require("../vector/embed");
const { OPENROUTER_MODEL, GEMINI_MODEL } = require("../config/aiConfig");
const { optionalAuth } = require("../middleware/auth");
const { 
  generateReasonedResponse, 
  calculateConfidence,
  parseAndEnhanceQuery,
  performEnhancedSearch,
  generateStructuredDecision,
  analyzeClaimEligibility
} = require("../llm/reasoningEngine");

// Helper function to build Qdrant search filters
function buildSearchFilter(userId, fileName, documentIds) {
  const mustFilters = [];

  if (userId) {
    mustFilters.push({ key: 'userId', match: { value: userId } });
  }

  if (documentIds && Array.isArray(documentIds) && documentIds.length > 0) {
    // If specific document IDs selected
    if (documentIds.length === 1) {
      mustFilters.push({ key: 'documentId', match: { value: documentIds[0] } });
    } else {
      mustFilters.push({
        should: documentIds.map(id => ({ key: 'documentId', match: { value: id } }))
      });
    }
  } else if (fileName) {
    mustFilters.push({ key: 'fileName', match: { value: fileName } });
  }

  return mustFilters.length > 0 ? { must: mustFilters } : null;
}

// Helper function to perform vector query safely across Qdrant SDK versions
async function queryQdrant(collectionName, searchParams) {
  const queryPayload = {
    query: searchParams.vector,
    limit: searchParams.limit || 8,
    with_payload: searchParams.with_payload ?? true,
    score_threshold: searchParams.score_threshold
  };

  if (searchParams.filter) {
    queryPayload.filter = searchParams.filter;
  }

  // Use query() for newer SDK versions, fallback to search() if using legacy client instance
  if (typeof qdrantClient.query === 'function') {
    const result = await qdrantClient.query(collectionName, queryPayload);
    return result.points || result.result || result || [];
  } else if (typeof qdrantClient.search === 'function') {
    const result = await qdrantClient.search(collectionName, searchParams);
    return result.result || result || [];
  } else {
    throw new Error("qdrantClient does not support query or search operations.");
  }
}

router.post("/ask", optionalAuth, async (req, res) => {
  try {
    const { 
      query, 
      fileName, 
      documentIds, 
      analysisType = 'DOCUMENT_ANALYSIS', 
      history = [],
      userProfile = null
    } = req.body;
    
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }

    const userId = req.user?.uid;
    console.log(`[>] AI Query: "${query}" (User: ${userId || 'guest'})`);
    
    const vector = await getEmbedding(query);
    
    const searchParams = {
      vector,
      limit: 8,
      with_payload: true,
      score_threshold: 0.1
    };
    
    const filter = buildSearchFilter(userId, fileName, documentIds);
    if (filter) {
      searchParams.filter = filter;
    }

    let searchResults = [];
    try {
      searchResults = await queryQdrant("policy_documents", searchParams);
    } catch (searchError) {
      console.warn("[!] Qdrant user-filtered search fallback:", searchError.message);
      // Fallback without userId filter
      delete searchParams.filter;
      searchResults = await queryQdrant("policy_documents", searchParams);
    }
    
    console.log(`[>] Found ${searchResults.length} relevant chunks`);

    if (searchResults.length === 0) {
      return res.json({
        query,
        response: "I couldn't find relevant information in your uploaded documents. Please make sure your documents are selected or upload new documents.",
        confidence: { score: 0, level: 'Very Low' },
        sourceChunks: [],
        hasContent: false
      });
    }

    const llmResult = await generateReasonedResponse(query, searchResults, analysisType, history, userProfile);
    const confidence = calculateConfidence(searchResults, llmResult.response);
    
    res.json({
      query,
      response: llmResult.response,
      followUpQuestions: llmResult.followUpQuestions || [],
      confidence,
      sourceChunks: searchResults,
      hasContent: llmResult.hasContent,
      metadata: {
        chunkCount: searchResults.length,
        timestamp: new Date().toISOString(),
        model: OPENROUTER_MODEL || GEMINI_MODEL
      }
    });

  } catch (error) {
    console.error("[x] AI Assistant error:", error);
    res.status(500).json({ 
      error: "AI Assistant failed", 
      details: error.message
    });
  }
});

router.post("/ask-smart", optionalAuth, async (req, res) => {
  try {
    const { 
      query, 
      fileName, 
      documentIds,
      returnStructured = false, 
      history = [],
      userProfile = null
    } = req.body;
    
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }

    const userId = req.user?.uid;
    console.log(`[>] Smart AI Query: "${query}" (User: ${userId || 'guest'})`);
    
    const parsedQuery = await parseAndEnhanceQuery(query, userProfile);
    
    const vector = await getEmbedding(query);
    
    const searchParams = {
      vector,
      limit: 15,
      with_payload: true,
      score_threshold: 0.01
    };
    
    const filter = buildSearchFilter(userId, fileName, documentIds);
    if (filter) {
      searchParams.filter = filter;
    }

    let searchResults = [];
    try {
      searchResults = await queryQdrant("policy_documents", searchParams);
    } catch (searchError) {
      console.warn("[!] Qdrant user-filtered smart search fallback:", searchError.message);
      delete searchParams.filter;
      searchResults = await queryQdrant("policy_documents", searchParams);
    }
    
    console.log(`[>] Found ${searchResults.length} relevant chunks`);

    if (returnStructured) {
      const structuredDecision = await generateStructuredDecision(query, searchResults, parsedQuery, history, userProfile);
      const confidence = calculateConfidence(searchResults, JSON.stringify(structuredDecision));
      
      res.json({
        query,
        parsedQuery,
        decision: structuredDecision,
        confidence,
        sourceChunks: searchResults,
        metadata: {
          chunkCount: searchResults.length,
          timestamp: new Date().toISOString(),
          model: OPENROUTER_MODEL || GEMINI_MODEL,
          processingType: 'structured'
        }
      });
    } else {
      const llmResult = await generateReasonedResponse(query, searchResults, 'CLAIM_ANALYSIS', history, userProfile);
      const confidence = calculateConfidence(searchResults, llmResult.response);
      
      res.json({
        query,
        parsedQuery,
        response: llmResult.response,
        followUpQuestions: llmResult.followUpQuestions || [],
        confidence,
        sourceChunks: searchResults,
        hasContent: llmResult.hasContent,
        metadata: {
          chunkCount: searchResults.length,
          timestamp: new Date().toISOString(),
          model: OPENROUTER_MODEL || GEMINI_MODEL,
          processingType: 'conversational'
        }
      });
    }

  } catch (error) {
    console.error("[x] Smart AI Assistant error:", error);
    res.status(500).json({ 
      error: "Smart AI Assistant failed", 
      details: error.message
    });
  }
});

module.exports = router;