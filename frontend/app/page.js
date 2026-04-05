"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { analyzeReview } from "@/services/api";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await analyzeReview(text.trim());
      setResult(res);
    } catch (err) {
      setError("Unable to reach the backend. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAnalyze();
  };

  const scorePercent = result ? Math.round(result.score * 100) : 0;
  const isFake = result?.label === "Fake";

  return (
    <div className="min-h-screen bg-[#070c18]">
      <Navbar />

      {/* Hero */}
      <section className="text-center pt-16 pb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Detect Fake Reviews
          <span className="block text-cyan-400">
            Instantly & Accurately
          </span>
        </h1>
      </section>

      {/* Analyzer */}
      <main className="max-w-3xl mx-auto px-4 pb-20">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">

          {/* Input */}
          <textarea
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white resize-none min-h-[150px]"
            placeholder="Enter review..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-cyan-500 px-6 py-2 rounded-lg text-white"
            >
              {loading ? "Analyzing..." : "Analyze Review"}
            </button>

            {result && (
              <button
                onClick={() => {
                  setText("");
                  setResult(null);
                }}
                className="text-gray-400"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 text-red-400">
            ⚠ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <ResultCard
            result={result}
            isFake={isFake}
            scorePercent={scorePercent}
          />
        )}
      </main>
    </div>
  );
}

/* ───────── RESULT CARD ───────── */
function ResultCard({ result, isFake, scorePercent }) {
  const border = isFake
    ? "border-rose-500/30"
    : "border-emerald-500/30";

  const bar = isFake
    ? "from-rose-500 to-rose-400"
    : "from-emerald-500 to-emerald-400";

  return (
    <div className={`mt-6 bg-white/[0.03] border ${border} rounded-2xl p-6`}>
      
      <h2 className="text-white font-bold mb-4">
        Analysis Result
      </h2>

      {/* Result */}
      <p className="text-white mb-2">
        Result: <strong>{result.label}</strong>
      </p>

      <p className="text-gray-400 mb-4">
        Confidence: {scorePercent}%
      </p>

      {/* Progress */}
      <div className="w-full h-2 bg-white/10 rounded mb-4">
        <div
          className={`h-full bg-gradient-to-r ${bar}`}
          style={{ width: `${scorePercent}%` }}
        />
      </div>

      {/* 🔥 RESIZABLE TEXTAREA */}
      <textarea
        value={result.text}
        readOnly
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white resize both min-h-[120px] max-h-[400px]"
      />
    </div>
  );
}