// lib/gemini.js
// Using Hugging Face Inference API

/**
 * Sends a prompt to Hugging Face and returns the text response.
 * @param {string} prompt - The full prompt to send
 * @returns {Promise<string>} - The model's text response
 */
export async function callGemini(prompt) {
// lib/gemini.js
// Using Hugging Face Inference API

/**
 * Sends a prompt to Hugging Face and returns the text response.
 * @param {string} prompt - The full prompt to send
 * @returns {Promise<string>} - The model's text response
 */
export async function callGemini(prompt) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not set in environment variables.");
  }

  // Using the correct Hugging Face Inference API endpoint
  const endpoint = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 2048,
        temperature: 0.2,
        do_sample: true,
      },
      wait_for_model: true,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Hugging Face API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();

  // Extract text from Hugging Face response
  let text;
  if (Array.isArray(data)) {
    text = data[0]?.generated_text;
  } else if (data.generated_text) {
    text = data.generated_text;
  } else if (data[0]?.generated_text) {
    text = data[0].generated_text;
  }

  if (!text) {
    console.error("Hugging Face response:", JSON.stringify(data));
    throw new Error("Hugging Face returned an empty response. Try again in 30 seconds.");
  }

  // Strip the prompt from the output (Hugging Face repeats it)
  if (text.includes(prompt)) {
    text = text.split(prompt)[1]?.trim() || text;
  }

  return text.trim();
}
