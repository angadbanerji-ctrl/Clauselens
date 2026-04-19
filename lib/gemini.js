// lib/gemini.js
// Using Hugging Face Inference API with a working model

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

  // Using google/flan-t5-large - a reliable model with Inference API
  const modelId = "google/flan-t5-large";
  const endpoint = `https://api-inference.huggingface.co/models/${modelId}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 2048,
        },
        wait_for_model: true,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Hugging Face API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();

    // Handle different response formats from Hugging Face
    let text;
    
    if (Array.isArray(data) && data.length > 0) {
      text = data[0]?.generated_text || data[0]?.summary_text;
    } else if (data.generated_text) {
      text = data.generated_text;
    } else if (data.summary_text) {
      text = data.summary_text;
    }

    if (!text) {
      console.error("Hugging Face full response:", JSON.stringify(data));
      throw new Error("Hugging Face returned empty response. Model may be loading.");
    }

    return text.trim();
  } catch (error) {
    throw error;
  }
}
