require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const parseDocument = require("./parsing/parseDocument");
const storeChunks = require("./vector/storeChunks");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
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

    await storeChunks(chunks, { fileName: req.file.originalname });

    res.json({
      message: "File parsed and chunks stored successfully",
      chunks,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Parsing failed", details: error.message });
  }
});

app.use("/", require("./routes/query"));

app.listen(3001, () => console.log("✅ Backend running on http://localhost:3001"));
