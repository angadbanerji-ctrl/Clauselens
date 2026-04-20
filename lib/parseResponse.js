// lib/parseResponse.js
// Parses the Gemini markdown response into structured sections

/**
 * Parses the model's response text into a structured object.
 * More robust handling of different response formats.
 * @param {string} rawText - The raw markdown text from Gemini
 * @returns {object} - Structured analysis object
 */
export function parseResponse(rawText) {
  // Store raw response for debugging
  const result = { raw: rawText };

  if (!rawText || rawText.trim().length === 0) {
    return {
      clauseType: "Unable to determine",
      riskLevel: "Unknown",
      riskBadge: "Unknown",
      marketComparison: "Gemini returned empty response",
      keyIssues: "Please try again or paste a different clause",
      recommendedRevisions: "",
      revisedClause: "",
      raw: rawText,
    };
  }

  // Split by ## headings more flexibly
  const lines = rawText.split("\n");
  let currentSection = null;
  const sections = {
    clauseType: "",
    riskLevel: "",
    marketComparison: "",
    keyIssues: "",
    recommendedRevisions: "",
    revisedClause: "",
  };

  // Map of possible heading variations to section keys
  const headingMap = {
    "clause type": "clauseType",
    "risk level": "riskLevel",
    "comparison with market standard": "marketComparison",
    "market standard comparison": "marketComparison",
    "key issues": "keyIssues",
    "key issues & red flags": "keyIssues",
    "red flags": "keyIssues",
    "recommended revisions": "recommendedRevisions",
    "revisions": "recommendedRevisions",
    "revised clause": "revisedClause",
    "revised version": "revisedClause",
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim().toLowerCase();

    // Check if this line is a heading
    if (line.startsWith("##")) {
      // Extract heading text
      const headingText = line
        .replace(/^#+\s*/, "")
        .trim()
        .toLowerCase();

      // Find matching section
      for (const [key, sectionKey] of Object.entries(headingMap)) {
        if (headingText.includes(key)) {
          currentSection = sectionKey;
          break;
        }
      }
    } else if (currentSection && line.trim()) {
      // Add content to current section
      sections[currentSection] += line + "\n";
    }
  }

  // Clean up whitespace
  for (const key in sections) {
    sections[key] = sections[key].trim();
  }

  // Extract risk badge
  let riskBadge = "Unknown";
  const riskText = sections.riskLevel.toLowerCase();
  if (riskText.includes("high")) {
    riskBadge = "High";
  } else if (riskText.includes("moderate")) {
    riskBadge = "Moderate";
  } else if (riskText.includes("low")) {
    riskBadge = "Low";
  }

  return {
    clauseType: sections.clauseType || "Unknown",
    riskLevel: sections.riskLevel || "Unknown",
    riskBadge: riskBadge,
    marketComparison: sections.marketComparison || "No information available",
    keyIssues: sections.keyIssues || "No information available",
    recommendedRevisions: sections.recommendedRevisions || "No information available",
    revisedClause: sections.revisedClause || "No revised clause provided",
    raw: rawText,
  };
}
