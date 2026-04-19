// pages/index.jsx
// ClauseLens — Main application page

import { useState } from "react";
import Head from "next/head";
import RiskBadge from "../components/RiskBadge";
import AnalysisSection from "../components/AnalysisSection";
import LoadingSpinner from "../components/LoadingSpinner";
import SampleClauses from "../components/SampleClauses";

export default function Home() {
  const [clause, setClause]       = useState("");
  const [analysis, setAnalysis]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [charCount, setCharCount] = useState(0);

  const MAX_CHARS = 5000;

  /** Handles textarea input and tracks character count */
  function handleInput(e) {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setClause(val);
      setCharCount(val.length);
    }
  }

  /** Clears the form and results */
  function handleReset() {
    setClause("");
    setAnalysis(null);
    setError("");
    setCharCount(0);
  }

  /** Calls the /api/analyze endpoint */
  async function handleAnalyze() {
    if (!clause.trim()) {
      setError("Please paste a contract clause before analysing.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clause }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Analysis failed. Please try again.");
      }

      setAnalysis(data.analysis);

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err.message || "Something went wrong. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>ClauseLens — Contract Clause Risk Analyser</title>
        <meta name="description" content="AI-powered legal clause risk analysis tool" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-[#F7F6F2] font-sans">

        {/* ── Header ── */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo mark */}
              <div className="w-8 h-8 rounded-lg bg-indigo-700 flex items-center justify-center">
                <span className="text-white text-sm font-bold font-serif">CL</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 tracking-tight leading-none"
                    style={{ fontFamily: "Lora, serif" }}>
                  ClauseLens
                </h1>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase">
                  Contract Risk Analyser
                </p>
              </div>
            </div>
            <span className="hidden sm:block text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1">
              Powered by Gemini
            </span>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto px-6 pt-12 pb-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-3"
                style={{ fontFamily: "Lora, serif" }}>
              Know what's in your{" "}
              <span className="italic text-indigo-700">contract</span>{" "}
              before you sign it.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Paste any contract clause to get an instant AI legal analysis —
              clause classification, risk rating, issue breakdown, and a
              revised draft.
            </p>
          </div>

          {/* ── Input Card ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">

            {/* Sample clauses */}
            <SampleClauses onSelect={(text) => { setClause(text); setCharCount(text.length); setAnalysis(null); setError(""); }} />

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={clause}
                onChange={handleInput}
                placeholder="Paste your contract clause here...

e.g. 'The Supplier shall indemnify and hold harmless the Customer from and against any and all claims...'"
                rows={8}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent leading-relaxed font-mono"
              />
              <div className={`absolute bottom-3 right-3 text-xs ${charCount > MAX_CHARS * 0.9 ? "text-amber-500" : "text-gray-400"}`}>
                {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <span className="text-red-500 mt-0.5">✕</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleAnalyze}
                disabled={loading || !clause.trim()}
                className="flex-1 sm:flex-none px-8 py-3 bg-indigo-700 text-white text-sm font-semibold rounded-xl hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading ? "Analysing..." : "Analyse Clause →"}
              </button>
              {clause && (
                <button
                  onClick={handleReset}
                  className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Loading State ── */}
        {loading && (
          <section className="max-w-4xl mx-auto px-6 py-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <LoadingSpinner />
            </div>
          </section>
        )}

        {/* ── Results ── */}
        {analysis && !loading && (
          <section id="results" className="max-w-4xl mx-auto px-6 pb-16 space-y-4">

            {/* Summary header bar */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Clause Identified As</p>
                  <p className="text-xl font-bold text-gray-900" style={{ fontFamily: "Lora, serif" }}>
                    {analysis.clauseType || "Unknown Clause Type"}
                  </p>
                </div>
                <RiskBadge level={analysis.riskBadge} />
              </div>

              {/* Risk level description */}
              {analysis.riskLevel && (
                <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2 border border-gray-100">
                  {analysis.riskLevel}
                </p>
              )}
            </div>

            {/* Detailed sections */}
            <div className="grid gap-4">
              <AnalysisSection
                title="Market Standard Comparison"
                content={analysis.marketComparison}
                accent="blue"
              />
              <AnalysisSection
                title="Key Issues & Red Flags"
                content={analysis.keyIssues}
                accent={analysis.riskBadge === "High" ? "red" : analysis.riskBadge === "Moderate" ? "amber" : "emerald"}
              />
              <AnalysisSection
                title="Recommended Revisions"
                content={analysis.recommendedRevisions}
                accent="violet"
              />
              <AnalysisSection
                title="Revised Clause (Ready to Use)"
                content={analysis.revisedClause}
                accent="emerald"
                mono={true}
              />
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-center text-gray-400 pt-2">
              ⚖ This analysis is AI-generated and for informational purposes only. It does not constitute legal advice.
              Always consult a qualified lawyer before executing contracts.
            </p>
          </section>
        )}

        {/* ── Empty state / How it works ── */}
        {!analysis && !loading && (
          <section className="max-w-4xl mx-auto px-6 pb-16">
            <div className="grid sm:grid-cols-3 gap-4 mt-2">
              {[
                { icon: "⬇", title: "Paste Clause", desc: "Copy any clause from your contract and paste it into the box above." },
                { icon: "⚡", title: "AI Analysis", desc: "Gemini reviews the clause against market standard legal practice." },
                { icon: "✓", title: "Get Results", desc: "Receive a risk rating, issue breakdown, and a revised clause draft." },
              ].map((step) => (
                <div key={step.title} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                  <div className="text-2xl mb-3">{step.icon}</div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  );
}
