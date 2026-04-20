// lib/buildPrompt.js
// Constructs the structured legal analysis prompt for Gemini

/**
 * Builds the full prompt combining the clause, instructions, and knowledge base.
 * @param {string} clause - The contract clause provided by the user
 * @param {object} knowledgeBase - The parsed knowledge base JSON
 * @returns {string} - The complete prompt string
 */
export function buildPrompt(clause, knowledgeBase) {
  // Summarise the knowledge base into a compact JSON string for the prompt
  const kbSummary = JSON.stringify(knowledgeBase, null, 2);

  return `You are a corporate lawyer specialising in contract drafting and negotiation.

Your task: Analyse the following contract clause and provide a structured legal risk analysis.

IMPORTANT: You MUST return your response with these EXACT six sections, each starting with ##:

## Clause Type
[Identify the specific type of clause - e.g., Indemnity, Limitation of Liability, Termination, etc.]

## Risk Level
[Assign one of: Low / Moderate / High. Then explain in 1-2 sentences why this risk level was assigned.]

## Comparison with Market Standard
[Analyse how this clause compares to market standard practice. What is typical? How does this clause deviate?]

## Key Issues & Red Flags
[List each specific issue or red flag as a numbered point. For each point, explain what the issue is and why it matters.]

## Recommended Revisions
[List specific, actionable recommendations for improving the clause. For each recommendation, say what should be changed and why.]

## Revised Clause
[Provide a complete, clean, improved version of the clause that incorporates all your recommended changes. Make it ready to use.]

---

KNOWLEDGE BASE (Market Standards Reference):
${kbSummary}

---

CLAUSE TO ANALYSE:
"""
${clause}
"""

---

ANALYSIS (provide all six sections above):`;
}
