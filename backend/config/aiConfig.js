require("dotenv").config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

module.exports = {
  OPENROUTER_API_KEY,
  OPENROUTER_MODEL,
  OPENROUTER_BASE_URL,
  AI_MODEL: OPENROUTER_MODEL,
  GEMINI_MODEL: OPENROUTER_MODEL, // for backward compatibility
};
