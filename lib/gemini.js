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

  // Using meta-llama/Llama-2-70b-chat-hf — a powerful free model
  const modelId = "meta-llama/Llama-2-70b-chat-hf";
  const endpoint = `https://api-inference.huggingface.co/models/${modelId}`;

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
      },
      wait_for_model: true,  // Wait if model is loading
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Hugging Face API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();

  // Handle array response from Hugging Face
  let text;
  if (Array.isArray(data)) {
    text = data[0]?.generated_text;
  } else if (data.generated_text) {
    text = data.generated_text;
  }

  if (!text) {
    throw new Error("Hugging Face returned an empty response. Model may be loading — try again in 30 seconds.");
  }

  // Hugging Face repeats your prompt in the output — strip it
  if (text.includes(prompt)) {
    text = text.split(prompt)[1]?.trim() || text;
  }

  return text;
}
