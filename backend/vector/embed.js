const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_TOKEN);

async function getEmbedding(text) {
  try {
    const model = "sentence-transformers/all-MiniLM-L6-v2";
    const embedding = await client.featureExtraction({ model, inputs: text });
    return embedding;
  } catch (error) {
    console.error("[x] Embedding generation failed: ",error);
    throw error;
  }
}

module.exports = getEmbedding;
