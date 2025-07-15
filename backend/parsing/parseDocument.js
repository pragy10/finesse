const fs = require("fs");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const tesseract = require("tesseract.js");
const path = require("path");
const { simpleParser } = require("mailparser");

async function parseDocument(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  let extractedText = "";

  if (ext === ".pdf") {
    const dataBuffer = fs.readFileSync(file.path);
    const data = pdfParse(dataBuffer);
    extractedText = (await data).text;
  } else if (ext === ".docx") {
    const data = await mammoth.extractRawText({ path: file.path });
    extractedText = data.value;
  } else if ([".jpg", ".png", ".jpeg"].includes(ext)) {
    const result = await tesseract.recognize(file.path, "eng");
    extractedText = result.data.text;
  } else if (ext === ".eml") {
    const data = await simpleParser(fs.createReadStream(file.path));
    extractedText = data.text;
  } else {
    throw new Error("Unsupported file type.");
  }

  return extractedText;
}

module.exports = parseDocument;
