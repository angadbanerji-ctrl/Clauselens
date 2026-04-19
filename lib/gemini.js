// lib/gemini.js
// Using Hugging Face Text Generation Inference API

/**
 * Sends a prompt to Hugging Face TGI and returns the text response.
 * @param {string} prompt - The full prompt to send
 * @returns {Promise<string>} - The model's text response
 */
export async function callGemini(prompt) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not set in environment variables.");
  }

  // Using Hugging Face's newer TGI endpoint for gpt-oss-120b
  const endpoint = "https://api-inference.huggingface.co/v1/text_generation";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "allenai/gpt-oss-120b-open-instruct",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.2,
      top_p: 0.95,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hugging Face API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Extract text from TGI response format
  let text;
  if (data?.generated_text) {
    text = data.generated_text;
  } else if (Array.isArray(data) && data[0]?.generated_text) {
    text = data[0].generated_text;
  }

  if (!text) {
    throw new Error(`Hugging Face returned empty response: ${JSON.stringify(data)}`);
  }

  return text.trim();
}
