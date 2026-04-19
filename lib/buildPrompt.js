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

Analyse the following clause and return a structured analysis using EXACTLY these six sections with these EXACT headings:

## Clause Type
[Identify the type of clause - e.g. Indemnity, Limitation of Liability, Termination, etc.]

## Risk Level
[Assign exactly one of: Low / Moderate / High — and in one sentence explain why]

## Comparison with Market Standard
[Compare this clause with standard market practice using the knowledge base provided. Note what is standard and what deviates.]

## Key Issues & Red Flags
[List each risk or red flag as a numbered point. Be specific about what the issue is and why it matters commercially or legally. Do not be generic.]

## Recommended Revisions
[List specific, actionable redline suggestions. For each issue, provide the suggested revised language or change.]

## Revised Clause
[Provide a complete, clean revised version of the clause that incorporates all recommended changes. This should be ready to use.]

---

Be specific. Avoid generic legal boilerplate in your analysis. Reference specific language from the clause.

Clause to analyse:
"""
${clause}
"""

Knowledge Base (use this to compare against market standard):
${kbSummary}
`;
}
