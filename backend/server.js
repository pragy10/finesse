const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const parseDocument = require("./parsing/parseDocument");

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
    
  try {
    const extractedText = await parseDocument(req.file);
    const chunks = extractedText
      .split("\n\n")
      .map((chunk) => chunk.trim())
      .filter(Boolean);

    res.json({
      message: "File parsed successfully",
      text: extractedText,
      chunks: chunks,
    });

  } catch (error) {
    res.status(500).json({ error: "Parsing failed", details: error.message });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
