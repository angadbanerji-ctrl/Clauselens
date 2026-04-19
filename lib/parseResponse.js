// lib/parseResponse.js
// Parses the Gemini markdown response into structured sections

/**
 * Parses the model's response text into a structured object.
 * Looks for ## headings and extracts the content beneath each.
 * @param {string} rawText - The raw markdown text from Gemini
 * @returns {object} - Structured analysis object
 */
export function parseResponse(rawText) {
  // Define the sections we expect, in order
  const sections = [
    { key: "clauseType",           heading: "Clause Type" },
    { key: "riskLevel",            heading: "Risk Level" },
    { key: "marketComparison",     heading: "Comparison with Market Standard" },
    { key: "keyIssues",            heading: "Key Issues & Red Flags" },
    { key: "recommendedRevisions", heading: "Recommended Revisions" },
    { key: "revisedClause",        heading: "Revised Clause" },
  ];

  const result = {};

  sections.forEach((section, index) => {
    // Build a regex that captures content between this heading and the next
    const currentHeading = section.heading;
    const nextHeading = sections[index + 1]?.heading;

    let pattern;
    if (nextHeading) {
      // Match content between current heading and next heading
      pattern = new RegExp(
        `##\\s*${escapeRegex(currentHeading)}\\s*\\n([\\s\\S]*?)(?=##\\s*${escapeRegex(nextHeading)})`,
        "i"
      );
    } else {
      // Last section — match to end of string
      pattern = new RegExp(
        `##\\s*${escapeRegex(currentHeading)}\\s*\\n([\\s\\S]*)$`,
        "i"
      );
    }

    const match = rawText.match(pattern);
    result[section.key] = match ? match[1].trim() : "";
  });

  // Extract risk level badge value (Low / Moderate / High)
  const riskText = result.riskLevel || "";
  if (/high/i.test(riskText)) result.riskBadge = "High";
  else if (/moderate/i.test(riskText)) result.riskBadge = "Moderate";
  else if (/low/i.test(riskText)) result.riskBadge = "Low";
  else result.riskBadge = "Unknown";

  // Store the raw response for debugging if needed
  result.raw = rawText;

  return result;
}

/** Escapes special regex characters in a string */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&");
}
