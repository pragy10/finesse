const { InferenceClient } = require("@huggingface/inference");
const client = new InferenceClient(process.env.HF_TOKEN);

async function getEmbedding(text) {
  const model = "sentence-transformers/all-MiniLM-L6-v2";
  const arr = await client.featureExtraction({ model, inputs: text });
  return arr;
}

module.exports = getEmbedding;
