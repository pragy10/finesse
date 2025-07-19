const qdrantClient = require('../vector/qdrantClient');

async function clearCollection(collectionName = 'policy_documents') {
    try {
        await qdrantClient.delete(collectionName, {
            filter: {} 
        });
        console.log(`[✓] Cleared all documents from ${collectionName}`);
    } catch (error) {
        console.error('[x] Error clearing collection:', error);
        throw error;
    }
}

module.exports = clearCollection;
