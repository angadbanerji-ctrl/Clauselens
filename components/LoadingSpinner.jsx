// components/LoadingSpinner.jsx
// Animated loading state shown while Gemini processes the clause

export default function LoadingSpinner() {
  const steps = [
    "Identifying clause type...",
    "Comparing with market standard...",
    "Flagging risks and deviations...",
    "Drafting revised clause...",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      {/* Animated ring */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-gray-700">Analysing clause...</p>
        <p className="text-xs text-gray-400">This usually takes 5–10 seconds</p>
      </div>

      {/* Animated step indicators */}
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-xs text-gray-500 animate-pulse"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
