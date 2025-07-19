

function smartChunker(text, maxChunkSize=500){
    const paragraphs = text.split(/\n\s*\n|\n(?=[A-Z][a-z]+:)|\n(?=•)|\n(?=\d+\.)/)
    .map(p => p.trim())
    .filter(p => p.length > 20);

    const chunks = [];
    let currentChunk = "";
    
    for(const paragraph of paragraphs){
        if(currentChunk.length + paragraph.length > maxChunkSize){
            if(currentChunk) chunks.push(currentChunk.trim());
            currentChunk = paragraph;
        }else{
            currentChunk += (currentChunk? "\n\n" : "") + paragraph;
        }
    }

    if(currentChunk) chunks.push(currentChunk.trim());
    return chunks.filter(chunk => chunk.length>0);
}

module.exports = smartChunker;