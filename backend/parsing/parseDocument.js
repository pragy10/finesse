const fs = require("fs");
const { LlamaParseReader } = require("llama-cloud-services");
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js");

async function parseDocument(file) {
  const ext = file.originalname.split(".").pop().toLowerCase();
  const path = file.path;

  if (ext === "pdf") {
    const reader = new LlamaParseReader({
      apiKey: process.env.LLAMA_CLOUD_API_KEY,
      resultType: "markdown",
      parsingInstruction: "Extract all policy benefit tables, daily allowance rates, sub-limits, and exclusions accurately into markdown tables.",
    });

    const documents = await reader.loadData(path);
    const parsedText = documents.map((doc) => doc.text).join("\n\n");

    console.log(`\n--- [LlamaParse Output for: ${file.originalname}] ---`);
    console.log(`[+] Total Pages Extracted: ${documents.length}`);
    console.log(`[+] Total Characters: ${parsedText.length}`);
    console.log("--- Sample Content (First 1500 chars) ---");
    console.log(parsedText.substring(0, 1500));
    console.log("---------------------------------------------------\n");

    return parsedText;
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
