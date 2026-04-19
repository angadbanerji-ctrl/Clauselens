// lib/gemini.js
// Updated to use Cohere API instead of Gemini

/**
 * Sends a prompt to the Cohere API and returns the text response.
 * @param {string} prompt - The full prompt to send
 * @returns {Promise<string>} - The model's text response
 */
export async function callGemini(prompt) {
  const apiKey = process.env.COHERE_API_KEY;

  if (!apiKey) {
    throw new Error("COHERE_API_KEY is not set in environment variables.");
  }

  const endpoint = "https://api.cohere.ai/v1/generate";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "command-r-plus",  // Cohere's most capable free model
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.2,  // Low temp for consistent legal analysis
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Cohere API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();

  // Extract text from Cohere response structure
  const text = data?.generations?.[0]?.text;

  if (!text) {
    throw new Error("Cohere returned an empty response.");
  }

  return text;
}
