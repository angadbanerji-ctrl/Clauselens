// components/AnalysisSection.jsx
// Renders a single analysis section with a title and markdown-like content

/**
 * Converts plain text with numbered lists and line breaks into JSX.
 * Handles numbered lists (1. 2. 3.) and bold (**text**) markers.
 */
function renderContent(text) {
  if (!text) return <p className="text-gray-400 italic">No information available.</p>;

  // Split into lines
  const lines = text.split("\n").filter((l) => l.trim() !== "");

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // Remove leading markdown bold markers for cleaner rendering
        const cleaned = line
          .replace(/\*\*(.*?)\*\*/g, "$1") // strip **bold**
          .replace(/^\*\s+/, "• ");         // convert * list items

        // Check if it's a numbered list item
        const numbered = /^\d+\.\s/.test(cleaned);

        return (
          <p
            key={i}
            className={`text-sm leading-relaxed ${
              numbered ? "pl-4 border-l-2 border-gray-200" : ""
            } text-gray-700`}
          >
            {cleaned}
          </p>
        );
      })}
    </div>
  );
}

export default function AnalysisSection({ title, content, accent = "gray", mono = false }) {
  const accents = {
    gray:    "border-gray-300 bg-gray-50",
    blue:    "border-blue-300 bg-blue-50",
    amber:   "border-amber-300 bg-amber-50",
    emerald: "border-emerald-300 bg-emerald-50",
    red:     "border-red-300 bg-red-50",
    violet:  "border-violet-300 bg-violet-50",
  };

  const borderColor = {
    gray:    "border-l-gray-400",
    blue:    "border-l-blue-500",
    amber:   "border-l-amber-500",
    emerald: "border-l-emerald-500",
    red:     "border-l-red-500",
    violet:  "border-l-violet-500",
  };

  return (
    <div className={`rounded-xl border ${accents[accent]} border-l-4 ${borderColor[accent]} p-5`}>
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
        {title}
      </h3>
      {mono ? (
        <pre className="text-sm leading-relaxed text-gray-700 font-mono whitespace-pre-wrap break-words bg-white rounded-lg p-4 border border-gray-200">
          {content}
        </pre>
      ) : (
        renderContent(content)
      )}
    </div>
  );
}
