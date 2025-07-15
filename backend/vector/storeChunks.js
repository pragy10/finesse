const qdrantClient = require('./qdrantClient');
const getEmbedding = require('./embed');

async function storeChunks(chunks, metadata={}) {
    const collectionName = 'finesse';
    
}