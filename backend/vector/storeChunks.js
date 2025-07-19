const qdrantClient = require("./qdrantClient");
const getEmbedding = require("./embed");

async function storeChunks(chunks, metadata = {}) {
  try {
    const points = await Promise.all(
      chunks.map(async (chunk, i) => ({
        id: Math.floor(Date.now()*1000) + i,
        vector: await getEmbedding(chunk),
        payload: {
          text: chunk,
          ...metadata,
          chunkIndex: i,
          timestamp: new Date().toISOString()
        },
      }))
    );

    await qdrantClient.upsert("policy_documents", { points });
    console.log(`[✓] Stored ${points.length} chunks in vector db`);
  } catch (error) {
    console.error("Error storing chunks:", error);
    throw error;
  }
}

module.exports = storeChunks;
