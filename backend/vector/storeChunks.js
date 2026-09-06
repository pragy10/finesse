const qdrantClient = require("./qdrantClient");
const getEmbedding = require("./embed");

async function storeChunks(chunks, metadata = {}) {
  try {
    const points = await Promise.all(
      chunks.map(async (chunk, i) => {
        const pointId = Math.floor(Date.now() * 1000) + i;
        const vector = await getEmbedding(chunk);
        return {
          id: pointId,
          vector,
          payload: {
            text: chunk,
            ...metadata,
            chunkIndex: i,
            timestamp: new Date().toISOString()
          },
        };
      })
    );

    await qdrantClient.upsert("policy_documents", { points });
    console.log(`[✓] Stored ${points.length} chunks in vector db for document ${metadata.fileName || ''} (User: ${metadata.userId || 'anonymous'})`);
    
    return points.map(p => p.id);
  } catch (error) {
    console.error("Error storing chunks:", error);
    throw error;
  }
}

module.exports = storeChunks;
