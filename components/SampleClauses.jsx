// components/SampleClauses.jsx
// Provides one-click sample clauses to demonstrate the tool

const SAMPLES = [
  {
    label: "⚠ High Risk Indemnity",
    text: `The Supplier shall indemnify, defend, and hold harmless the Customer and its officers, directors, employees, agents, successors, and assigns from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to: (a) any breach of this Agreement by the Supplier; (b) any negligent or wrongful act or omission of the Supplier; or (c) any third-party claims relating to the products or services provided hereunder. This indemnification obligation shall be unlimited in scope and amount and shall survive termination of this Agreement indefinitely.`,
  },
  {
    label: "⚠ Weak Limitation of Liability",
    text: `In no event shall either party be liable to the other for any indirect, incidental, special, consequential, or punitive damages. The total aggregate liability of the Vendor under this Agreement shall not exceed the greater of (i) one hundred dollars ($100) or (ii) the fees paid by Customer in the one (1) month immediately preceding the event giving rise to the claim, regardless of the form of action and whether such liability arises in contract, tort, or otherwise.`,
  },
  {
    label: "✓ Standard Termination",
    text: `Either party may terminate this Agreement for cause upon thirty (30) days' written notice to the other party if the other party materially breaches this Agreement and fails to cure such breach within the thirty (30) day notice period. Either party may terminate this Agreement for convenience upon ninety (90) days' prior written notice. Upon termination, each party shall promptly return or destroy the other party's confidential information and the Customer shall pay all fees accrued up to the date of termination.`,
  },
];

export default function SampleClauses({ onSelect }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Try a sample clause
      </p>
      <div className="flex flex-wrap gap-2">
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            onClick={() => onSelect(s.text)}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
