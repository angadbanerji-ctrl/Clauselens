// lib/gemini.js
// Using Hugging Face Inference API with gpt-oss-120b

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

  // Using gpt-oss-120b model
  const endpoint = "https://api-inference.huggingface.co/models/allenai/gpt-oss-120b";

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
      options: {
        wait_for_model: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hugging Face API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Extract text from response
  let text;
  if (Array.isArray(data) && data[0]) {
    text = data[0]?.generated_text;
  } else if (data?.generated_text) {
    text = data.generated_text;
  }

  if (!text) {
    throw new Error(`Hugging Face returned empty response: ${JSON.stringify(data)}`);
  }

  return text.trim();
}
