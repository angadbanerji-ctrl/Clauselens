// components/RiskBadge.jsx
// Displays a colour-coded risk level badge

export default function RiskBadge({ level }) {
  const styles = {
    High:     "bg-red-100 text-red-800 border border-red-300",
    Moderate: "bg-amber-100 text-amber-800 border border-amber-300",
    Low:      "bg-emerald-100 text-emerald-800 border border-emerald-300",
    Unknown:  "bg-gray-100 text-gray-600 border border-gray-300",
  };

  const icons = {
    High:     "⚠",
    Moderate: "◈",
    Low:      "✓",
    Unknown:  "?",
  };

  const cls = styles[level] || styles.Unknown;
  const icon = icons[level] || icons.Unknown;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold tracking-wide ${cls}`}>
      <span>{icon}</span>
      {level} Risk
    </span>
  );
}
