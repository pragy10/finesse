const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { requireAuth } = require("../middleware/auth");
const { db } = require("../config/firebaseAdmin");
const { supabase, BUCKET_NAME } = require("../config/supabaseClient");
const qdrantClient = require("../vector/qdrantClient");
const parseDocument = require("../parsing/parseDocument");
const smartChunker = require("../setup/smartChunker");
const storeChunks = require("../vector/storeChunks");

// Configure temporary disk storage for parsing
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// GET /documents - List all documents for the authenticated user
router.get("/documents", requireAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const docsRef = db.collection("users").doc(userId).collection("documents");
    const snapshot = await docsRef.orderBy("uploadTime", "desc").get();

    const documents = [];
    snapshot.forEach(doc => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      documents,
      totalCount: documents.length
    });
  } catch (error) {
    console.error("[x] Error fetching user documents:", error);
    res.status(500).json({ error: "Failed to fetch documents", details: error.message });
  }
});

// POST /documents/upload - Upload, parse, store in Supabase + Qdrant + Firestore
router.post("/documents/upload", requireAuth, upload.array("files", 10), async (req, res) => {
  const files = req.files || [];
  const userId = req.user.uid;

  if (files.length === 0) {
    return res.status(400).json({ error: "No files provided for upload" });
  }

  console.log(`[>] Processing ${files.length} document(s) for user: ${userId}`);
  const processedFiles = [];
  let totalChunksCount = 0;

  for (const file of files) {
    const tempPath = file.path;
    try {
      console.log(`[>] Parsing ${file.originalname}...`);
      const extractedText = await parseDocument(file);
      const chunks = smartChunker(extractedText, 500);
      console.log(`[>] Created ${chunks.length} chunks for ${file.originalname}`);

      // Read file buffer for Supabase upload
      const fileBuffer = fs.readFileSync(tempPath);
      const storagePath = `${userId}/${Date.now()}-${file.originalname}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
          contentType: file.mimetype || "application/octet-stream",
          upsert: true
        });

      if (uploadError) {
        console.warn(`[!] Supabase upload warning for ${file.originalname}:`, uploadError.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);
      const fileUrl = urlData?.publicUrl || "";

      // Document ID in Firestore
      const docRef = db.collection("users").doc(userId).collection("documents").doc();
      const documentId = docRef.id;

      // Store in Qdrant with userId and documentId attached
      const pointIds = await storeChunks(chunks, {
        fileName: file.originalname,
        userId,
        documentId,
        fileUrl
      });

      // Save document record in Firestore
      const docData = {
        id: documentId,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        storagePath,
        fileUrl,
        chunkCount: chunks.length,
        pointIds,
        uploadTime: new Date().toISOString(),
        userId
      };

      await docRef.set(docData);

      processedFiles.push({
        id: documentId,
        fileName: file.originalname,
        chunkCount: chunks.length,
        fileUrl,
        status: "success"
      });

      totalChunksCount += chunks.length;
      console.log(`[✓] Successfully processed and stored ${file.originalname}`);

    } catch (fileError) {
      console.error(`[x] Error processing ${file.originalname}:`, fileError);
      processedFiles.push({
        fileName: file.originalname,
        status: "failed",
        error: fileError.message
      });
    } finally {
      // Clean up temporary local file
      if (fs.existsSync(tempPath)) {
        try {
          fs.unlinkSync(tempPath);
        } catch (e) {
          console.warn("[!] Could not remove temp file:", e.message);
        }
      }
    }
  }

  res.json({
    message: `Processed ${processedFiles.filter(f => f.status === 'success').length}/${files.length} documents`,
    processedFiles,
    totalChunks: totalChunksCount
  });
});

// DELETE /documents/:docId - Delete document from Supabase, Qdrant & Firestore
router.delete("/documents/:docId", requireAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { docId } = req.params;

    const docRef = db.collection("users").doc(userId).collection("documents").doc(docId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Document not found" });
    }

    const docData = docSnap.data();

    // 1. Remove from Supabase Storage
    if (docData.storagePath) {
      try {
        await supabase.storage.from(BUCKET_NAME).remove([docData.storagePath]);
        console.log(`[✓] Removed ${docData.storagePath} from Supabase Storage`);
      } catch (storageErr) {
        console.warn("[!] Error deleting from Supabase:", storageErr.message);
      }
    }

    // 2. Remove points from Qdrant
    try {
      if (docData.pointIds && docData.pointIds.length > 0) {
        await qdrantClient.delete("policy_documents", {
          points: docData.pointIds
        });
      } else {
        await qdrantClient.delete("policy_documents", {
          filter: {
            must: [
              { key: "documentId", match: { value: docId } }
            ]
          }
        });
      }
      console.log(`[✓] Deleted Qdrant points for document: ${docId}`);
    } catch (qdrantErr) {
      console.warn("[!] Error deleting from Qdrant:", qdrantErr.message);
    }

    // 3. Delete from Firestore
    await docRef.delete();
    console.log(`[✓] Deleted document metadata from Firestore: ${docId}`);

    res.json({ message: "Document deleted successfully", id: docId });
  } catch (error) {
    console.error("[x] Delete document error:", error);
    res.status(500).json({ error: "Failed to delete document", details: error.message });
  }
});

// POST /documents/clear-all - Delete all documents for current user
router.post("/documents/clear-all", requireAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const docsRef = db.collection("users").doc(userId).collection("documents");
    const snapshot = await docsRef.get();

    const storagePaths = [];
    const deleteDocPromises = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.storagePath) storagePaths.push(data.storagePath);
      deleteDocPromises.push(doc.ref.delete());
    });

    // Delete all storage files
    if (storagePaths.length > 0) {
      await supabase.storage.from(BUCKET_NAME).remove(storagePaths);
    }

    // Delete all points for this user from Qdrant
    try {
      await qdrantClient.delete("policy_documents", {
        filter: {
          must: [
            { key: "userId", match: { value: userId } }
          ]
        }
      });
    } catch (qdrantErr) {
      console.warn("[!] Qdrant clear points error:", qdrantErr.message);
    }

    // Delete Firestore docs
    await Promise.all(deleteDocPromises);

    res.json({ message: "All documents cleared successfully", totalDocuments: 0 });
  } catch (error) {
    console.error("[x] Clear all documents error:", error);
    res.status(500).json({ error: "Failed to clear documents", details: error.message });
  }
});

module.exports = router;
