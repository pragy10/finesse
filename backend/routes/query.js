const express = require("express");
const router = express.Router();
const qdrantClient = require("../vector/qdrantClient");
const getEmbedding = require("../vector/embed");

router.post("/search", async (req, res) => {
  try {
    const { query, fileName } = req.body;
    
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }

    console.log(`[>] Searching for: "${query}"`);
    const vector = await getEmbedding(query);
    console.log(`[>] Query embedding generated (length: ${vector.length})`);
    
    const searchParams = {
      vector,
      limit: 10,
      with_payload: true,
      score_threshold: 0.1
    };
    
    if (fileName) {
      searchParams.filter = {
        must: [{ key: 'fileName', match: { value: fileName } }]
      };
    }

    const result = await qdrantClient.search("policy_documents", searchParams);
    console.log(`[>] Raw Qdrant response:`, result);
    
    const results = result.result || result || [];
    console.log(`[✓] Found ${results.length} matches`);
    
    if (results.length > 0) {
      results.forEach((item, i) => {
        console.log(`Match ${i + 1}: Score ${item.score}, File: ${item.payload?.fileName}`);
      });
    }
    
    res.json(results); 
  } catch (err) {
    console.error("[x] Search error:", err);
    res.status(500).json({ error: "Search failed", details: err.message });
  }
});

module.exports = router;
