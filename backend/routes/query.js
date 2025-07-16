const express = require("express");
const router = express.Router();
const qdrantClient = require("../vector/qdrantClient");
const getEmbedding = require("../vector/embed");

router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    const vector = await getEmbedding(query);
    
    const result = await qdrantClient.search("policy_documents", {
      vector,
      limit: 5,
    });
    
    console.log("Qdrant result:", result);
    console.log("Sending to frontend:", result.result || result);
    
    res.json(result.result || result);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});


module.exports = router;
