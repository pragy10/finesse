const { OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENROUTER_BASE_URL } = require('./aiConfig');

/**
 * Call OpenRouter Chat Completions API
 * @param {Object} options
 * @param {Array} [options.messages] - Array of { role, content } objects
 * @param {string} [options.system] - System prompt string (optional)
 * @param {string} [options.user] - User prompt string (optional)
 * @param {string} [options.prompt] - Single user prompt string (optional)
 * @param {number} [options.temperature] - Sampling temperature (default 0.1)
 * @param {number} [options.max_tokens] - Maximum tokens to generate (default 4096)
 * @param {string} [options.model] - Specific model ID to override default
 * @returns {Promise<{ text: string, usage: Object, raw: Object }>}
 */
async function callOpenRouter({
  messages,
  system,
  user,
  prompt,
  temperature = 0.1,
  max_tokens = 4096,
  model = OPENROUTER_MODEL
}) {
  const apiKey = process.env.OPENROUTER_API_KEY || OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_openrouter_api_key_here") {
    throw new Error(
      "OPENROUTER_API_KEY is not set in backend/.env. Please add your OpenRouter API key (get one from https://openrouter.ai/keys)."
    );
  }

  // Format messages array
  let formattedMessages = [];

  if (Array.isArray(messages) && messages.length > 0) {
    formattedMessages = messages;
  } else if (system && user) {
    formattedMessages = [
      { role: "system", content: system },
      { role: "user", content: user }
    ];
  } else if (prompt) {
    formattedMessages = [
      { role: "user", content: prompt }
    ];
  } else if (user) {
    formattedMessages = [
      { role: "user", content: user }
    ];
  } else {
    throw new Error("No prompt or messages provided to OpenRouter client.");
  }

  const selectedModel = model || OPENROUTER_MODEL || "deepseek/deepseek-chat";

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey.trim()}`,
      "HTTP-Referer": process.env.SITE_URL || "http://localhost:5173",
      "X-Title": "Finesse Document Intelligence",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: formattedMessages,
      temperature,
      max_tokens
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let parsedError;
    try {
      parsedError = JSON.parse(errorBody);
    } catch {
      parsedError = null;
    }

    const errorMessage =
      parsedError?.error?.message ||
      parsedError?.message ||
      `OpenRouter API HTTP ${response.status}: ${errorBody}`;

    console.error(`[x] OpenRouter error (${response.status}):`, errorMessage);
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || "";
  const usage = data?.usage || {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0
  };

  return {
    text,
    usage,
    raw: data
  };
}

module.exports = {
  callOpenRouter
};
