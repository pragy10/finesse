const express = require("express");
const router = express.Router();
const qdrantClient = require("../vector/qdrantClient");
const getEmbedding = require("../vector/embed");
const { 
  generateReasonedResponse, 
  calculateConfidence,
  parseAndEnhanceQuery,
  performEnhancedSearch,
  generateStructuredDecision,
  analyzeClaimEligibility
} = require("../llm/reasoningEngine");


router.post("/ask", async (req, res) => {
  try {
    const { query, fileName, analysisType = 'DOCUMENT_ANALYSIS' } = req.body;
    
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }

    console.log(`[>] AI Query: "${query}"`);
    
    const vector = await getEmbedding(query);
    
    const searchParams = {
      vector,
      limit: 8,
      with_payload: true,
      score_threshold: 0.1
    };
    
    if (fileName) {
      searchParams.filter = {
        must: [{ key: 'fileName', match: { value: fileName } }]
      };
    }

    const result = await qdrantClient.search("policy_documents", searchParams);
    const searchResults = result.result || result || [];
    
    console.log(`[>] Found ${searchResults.length} relevant chunks`);

    if (searchResults.length === 0) {
      return res.json({
        query,
        response: "I couldn't find relevant information in your documents. Please make sure you've uploaded documents related to your question.",
        confidence: { score: 0, level: 'Very Low' },
        sourceChunks: [],
        hasContent: false
      });
    }

    const llmResult = await generateReasonedResponse(query, searchResults, analysisType);
    const confidence = calculateConfidence(searchResults, llmResult.response);
    
    res.json({
      query,
      response: llmResult.response,
      confidence,
      sourceChunks: searchResults,
      hasContent: llmResult.hasContent,
      metadata: {
        chunkCount: searchResults.length,
        timestamp: new Date().toISOString(),
        model: 'gemini-1.5-flash'
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


router.post("/ask-smart", async (req, res) => {
  try {
    const { query, fileName, returnStructured = false } = req.body;
    
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }

    console.log(`[>] Smart AI Query: "${query}"`);
    
    
    const parsedQuery = await parseAndEnhanceQuery(query);
    
   
    const vector = await getEmbedding(query);
    
    const searchParams = {
      vector,
      limit: 10,
      with_payload: true,
      score_threshold: 0.05
    };
    
    if (fileName) {
      searchParams.filter = {
        must: [{ key: 'fileName', match: { value: fileName } }]
      };
    }

    const result = await qdrantClient.search("policy_documents", searchParams);
    let searchResults = result.result || result || [];
    
    console.log(`[>] Found ${searchResults.length} relevant chunks`);

    if (returnStructured) {
      const structuredDecision = await generateStructuredDecision(query, searchResults, parsedQuery);
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
          model: 'gemini-1.5-flash',
          processingType: 'structured'
        }
      });
    } else {
      const llmResult = await generateReasonedResponse(query, searchResults, 'CLAIM_ANALYSIS');
      const confidence = calculateConfidence(searchResults, llmResult.response);
      
      res.json({
        query,
        parsedQuery,
        response: llmResult.response,
        confidence,
        sourceChunks: searchResults,
        hasContent: llmResult.hasContent,
        metadata: {
          chunkCount: searchResults.length,
          timestamp: new Date().toISOString(),
          model: 'gemini-1.5-flash',
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
