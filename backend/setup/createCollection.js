const qdrantClient = require('../vector/qdrantClient');

async function createCollection() {
    try {
        
    } catch (error) {
        if(error.response && error.response.status === 409){
            console.log('Collection alread exists');
        }else{
            console.error('Error in creating collection: ',error);
        }
    }
}

createCollection();