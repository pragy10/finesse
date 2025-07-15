const qdrantClient = require("./qdrantClient");
const getEmbedding = require("./embed");

async function storeChunks(chunks, metadata = {}) {
  const points = await Promise.all(
    chunks.map(async (chunk, i) => ({
      id: Date.now() + i,
      vector: await getEmbedding(chunk),
      payload: { text: chunk, ...metadata }
    }))
  );

  await qdrantClient.upsert("policy_documents", { points });
}

module.exports = storeChunks;
