// lib/gemini.js
// Using Replicate API

/**
 * Sends a prompt to Replicate and returns the text response.
 * @param {string} prompt - The full prompt to send
 * @returns {Promise<string>} - The model's text response
 */
export async function callGemini(prompt) {
  const apiKey = process.env.REPLICATE_API_KEY;

  if (!apiKey) {
    throw new Error("REPLICATE_API_KEY is not set in environment variables.");
  }

  // Using Llama 2 via Replicate (free tier available)
  const endpoint = "https://api.replicate.com/v1/predictions";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "13c3cdee13ee059ab779f0291254bc2e324b61abb6c555053faf7639429eae99",
      input: {
        prompt: prompt,
        max_tokens: 2048,
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Replicate API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Poll for completion if the request is still processing
  let predictionId = data.id;
  let status = data.status;

  while (status === "processing") {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

    const pollResponse = await fetch(`${endpoint}/${predictionId}`, {
      method: "GET",
      headers: {
        "Authorization": `Token ${apiKey}`,
      },
    });

    if (!pollResponse.ok) {
      throw new Error(`Failed to poll Replicate: ${pollResponse.status}`);
    }

    const pollData = await pollResponse.json();
    status = pollData.status;

    if (status === "succeeded") {
      const output = pollData.output;
      let text;

      // Handle different output formats
      if (Array.isArray(output)) {
        text = output.join("");
      } else if (typeof output === "string") {
        text = output;
      }

      if (!text) {
        throw new Error("Replicate returned empty output");
      }

      return text.trim();
    } else if (status === "failed") {
      throw new Error(`Replicate prediction failed: ${pollData.error}`);
    }
  }

  // If already succeeded, return immediately
  if (status === "succeeded") {
    const output = data.output;
    let text;

    if (Array.isArray(output)) {
      text = output.join("");
    } else if (typeof output === "string") {
      text = output;
    }

    if (!text) {
      throw new Error("Replicate returned empty output");
    }

    return text.trim();
  }

  throw new Error(`Unexpected Replicate status: ${status}`);
}
