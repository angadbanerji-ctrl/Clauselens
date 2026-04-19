// pages/api/analyze.js
// API route: receives a clause, calls Gemini, returns structured analysis

import knowledgeBase from "../../data/knowledgeBase.json";
import { callGemini } from "../../lib/gemini";
import { buildPrompt } from "../../lib/buildPrompt";
import { parseResponse } from "../../lib/parseResponse";

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { clause } = req.body;

  // Validate input
  if (!clause || typeof clause !== "string" || clause.trim().length < 20) {
    return res.status(400).json({
      error: "Please provide a contract clause of at least 20 characters.",
    });
  }

  if (clause.trim().length > 5000) {
    return res.status(400).json({
      error: "Clause is too long. Please limit to 5000 characters.",
    });
  }

  try {
    // Build the structured legal analysis prompt
    const prompt = buildPrompt(clause.trim(), knowledgeBase);

    // Call the Gemini API
    const rawResponse = await callGemini(prompt);

    // Parse the response into structured sections
    const analysis = parseResponse(rawResponse);

    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error("[ClauseLens API Error]", error.message);

    // Return a user-friendly error message
    return res.status(500).json({
      error: error.message || "An unexpected error occurred during analysis.",
    });
  }
}
