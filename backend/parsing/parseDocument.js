const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js");

async function parseDocument(file) {
  const ext = file.originalname.split(".").pop().toLowerCase();
  const path = file.path;

  if (ext === "pdf") {
    const dataBuffer = fs.readFileSync(path);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ path });
    return result.value;
  }

  if (["jpg", "jpeg", "png"].includes(ext)) {
    const result = await Tesseract.recognize(path, "eng");
    return result.data.text;
  }

  throw new Error("Unsupported file type.");
}

module.exports = parseDocument;
