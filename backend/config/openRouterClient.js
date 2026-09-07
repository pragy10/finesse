const { OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENROUTER_BASE_URL } = require('./aiConfig');

// Fallback models tried in order if the primary model hits a 429 / provider error
const FALLBACK_MODELS = [
  'google/gemini-2.5-flash',
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Call OpenRouter Chat Completions API with retry + fallback model support.
 * Retries on 429 (rate limit) with exponential backoff, then tries fallback models.
 *
 * @param {Object} options
 * @param {Array}  [options.messages]    - Array of { role, content } objects
 * @param {string} [options.system]      - System prompt (optional shorthand)
 * @param {string} [options.user]        - User prompt (optional shorthand)
 * @param {string} [options.prompt]      - Single user prompt (optional shorthand)
 * @param {number} [options.temperature] - Sampling temperature (default 0.1)
 * @param {number} [options.max_tokens]  - Max tokens (default 4096)
 * @param {string} [options.model]       - Override model ID
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

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_openrouter_api_key_here') {
    throw new Error(
      'OPENROUTER_API_KEY is not set in backend/.env. Get one at https://openrouter.ai/keys'
    );
  }

  // Build messages array from shorthand options
  let formattedMessages = [];
  if (Array.isArray(messages) && messages.length > 0) {
    formattedMessages = messages;
  } else if (system && user) {
    formattedMessages = [
      { role: 'system', content: system },
      { role: 'user',   content: user  }
    ];
  } else if (prompt) {
    formattedMessages = [{ role: 'user', content: prompt }];
  } else if (user) {
    formattedMessages = [{ role: 'user', content: user }];
  } else {
    throw new Error('No prompt or messages provided to callOpenRouter.');
  }

  // Models to try: primary first, then fallbacks
  const primaryModel = model || OPENROUTER_MODEL || 'deepseek/deepseek-chat';
  const modelsToTry  = [primaryModel, ...FALLBACK_MODELS.filter((m) => m !== primaryModel)];

  let lastError = null;

  for (const currentModel of modelsToTry) {
    // Try each model up to 2 times (in case of transient 429)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization:  `Bearer ${apiKey.trim()}`,
            'HTTP-Referer': process.env.SITE_URL || 'http://localhost:5173',
            'X-Title':      'finesse Document Intelligence',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: currentModel,
            messages: formattedMessages,
            temperature,
            max_tokens
          })
        });

        if (response.ok) {
          const data  = await response.json();
          const text  = data?.choices?.[0]?.message?.content || '';
          const usage = data?.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

          if (currentModel !== primaryModel) {
            console.log(`[~] Used fallback model: ${currentModel}`);
          }

          return { text, usage, raw: data };
        }

        const status    = response.status;
        const errorBody = await response.text();
        let parsedError;
        try { parsedError = JSON.parse(errorBody); } catch { parsedError = null; }

        const errorMessage =
          parsedError?.error?.message ||
          parsedError?.message ||
          `OpenRouter HTTP ${status}: ${errorBody}`;

        if (status === 429) {
          // Rate limited — wait before retrying
          const retryAfter = parseInt(response.headers.get('retry-after') || '0', 10);
          const waitMs     = retryAfter > 0 ? retryAfter * 1000 : attempt * 2000;
          console.warn(`[!] OpenRouter 429 on ${currentModel} (attempt ${attempt}). Waiting ${waitMs}ms...`);
          lastError = new Error(errorMessage);
          await sleep(waitMs);
          continue; // retry same model
        }

        // Non-429 error — skip to next model immediately
        console.error(`[x] OpenRouter error (${status}) on ${currentModel}:`, errorMessage);
        lastError = new Error(errorMessage);
        break;

      } catch (fetchErr) {
        console.error(`[x] OpenRouter fetch failed on ${currentModel}:`, fetchErr.message);
        lastError = fetchErr;
        break;
      }
    }
  }

  // All models exhausted
  throw lastError || new Error('All OpenRouter models failed.');
}

module.exports = { callOpenRouter };
