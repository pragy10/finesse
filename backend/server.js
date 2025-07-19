require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const parseDocument = require("./parsing/parseDocument");
const storeChunks = require("./vector/storeChunks");
const clearCollection = require("./setup/clearCollection");
const smartChunker = require("./setup/smartChunker");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Track uploaded documents in memory
let uploadedDocuments = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Unified upload endpoint
app.post("/upload", upload.array("files", 10), async (req, res) => {
  try {
    const files = req.files || [];
    
    if (files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    console.log(`[>] Processing ${files.length} document(s)...`);
    
    const processedFiles = [];
    let totalChunks = 0;

    for (const file of files) {
      try {
        console.log(`[>] Processing ${file.originalname}...`);
        
        const extractedText = await parseDocument(file);
        const chunks = smartChunker(extractedText, 500);
        console.log(`[>] Created ${chunks.length} chunks for ${file.originalname}`);
        
        await storeChunks(chunks, { fileName: file.originalname });
        
        uploadedDocuments.push({
          fileName: file.originalname,
          uploadTime: new Date(),
          chunkCount: chunks.length,
          chunks // Store for potential summarization
        });

        processedFiles.push({
          fileName: file.originalname,
          chunkCount: chunks.length,
          status: 'success'
        });
        
        totalChunks += chunks.length;
        console.log(`[✓] ${file.originalname} processed successfully`);
        
      } catch (fileError) {
        console.error(`[x] Error processing ${file.originalname}:`, fileError);
        processedFiles.push({
          fileName: file.originalname,
          status: 'failed',
          error: fileError.message
        });
      }
    }

    console.log(`[✓] Batch complete. Total documents: ${uploadedDocuments.length}, Total chunks: ${totalChunks}`);

    res.json({
      message: `[✓] Successfully processed ${processedFiles.filter(f => f.status === 'success').length}/${files.length} files`,
      processedFiles,
      totalChunks,
      totalDocuments: uploadedDocuments.length
    });

  } catch (error) {
    console.error("[x] Upload error:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

// Get list of uploaded documents
app.get("/documents", (req, res) => {
  res.json({
    documents: uploadedDocuments,
    totalCount: uploadedDocuments.length
  });
});

// Clear all documents
app.post("/clear-all", async (req, res) => {
  try {
    console.log("[>] Clearing all documents from vector DB...");
    await clearCollection();
    uploadedDocuments = [];
    console.log("[✓] All documents cleared");
    
    res.json({
      message: "[✓] All documents cleared successfully",
      totalDocuments: 0
    });
  } catch (error) {
    console.error("[x] Clear error:", error);
    res.status(500).json({ error: "Failed to clear documents", details: error.message });
  }
});

// Basic search endpoint
app.use("/", require("./routes/query"));

// AI-powered ask endpoint
app.use("/", require("./routes/ask"));

app.listen(3001, () => {
  console.log("[✓] Backend running on http://localhost:3001");
  console.log("[✓] AI Assistant ready with LLM integration");
});
