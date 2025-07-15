require("dotenv").config();

const { QdrantClient } = require("@qdrant/js-client-rest");

console.log("Using Qdrant URL:", process.env.QDRANT_URL);

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = "policy_documents";
const VECTOR_SIZE = 384;
const DISTANCE = "Cosine";

async function createCollection() {
  try {
    await qdrantClient.createCollection(COLLECTION_NAME, {
      vectors: {
        size: VECTOR_SIZE,
        distance: DISTANCE,
      },
    });
    console.log(`Collection "${COLLECTION_NAME}" created successfully`);
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log("Collection alread exists");
    } else {
      console.error("Error in creating collection: ", error);
    }
  }
}

createCollection();
