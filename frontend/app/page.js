"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { analyzeReview } from "@/services/api";

export default function AnalyzePage() {
  const [text, setText]     = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

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
  const isFake       = result?.label === "Fake";

  return (
    <div className="min-h-screen bg-[#070c18]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[300px] rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI-Powered Detection
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Detect Fake Reviews
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Instantly &amp; Accurately
            </span>
          </h1>

        
        </div>
      </section>

      {/* ── Analyzer Card ── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">

          {/* Textarea */}
          <label className="block text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-3">
            Review Text
          </label>
          <textarea
            id="review-input"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-600 resize-none focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200 min-h-[160px] leading-relaxed"
            placeholder="Paste or type a review to analyze… "
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Character count */}
          <p className="text-right text-[10px] text-slate-600 mt-1 mb-4">
            {text.length} characters
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              id="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-cyan-500/30 disabled:to-blue-600/30 disabled:cursor-not-allowed text-white disabled:text-cyan-900 font-bold text-[11px] uppercase tracking-widest px-7 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 active:scale-95"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Analyze Review
                </>
              )}
            </button>

            {loading && (
              <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold animate-pulse">
                Processing…
              </p>
            )}

            {result && !loading && (
              <button
                onClick={() => { setText(""); setResult(null); }}
                className="text-[11px] uppercase tracking-widest text-slate-500 hover:text-slate-300 font-semibold transition-colors duration-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mt-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 text-rose-400 text-sm">
            ⚠ {error}
          </div>
        )}

        {/* ── Result Card ── */}
        {result && (
          <ResultCard result={result} isFake={isFake} scorePercent={scorePercent} onKeyDown={handleKeyDown} />
          
        )}
      </main>
    </div>
  );
}

/* ─── Result Card Component ─────────────────────────────── */
function ResultCard({ result, isFake, scorePercent }) {
  const color   = isFake ? "rose"    : "emerald";
  const bg      = isFake ? "rose-500" : "emerald-500";
  const border  = isFake ? "border-rose-500/30"    : "border-emerald-500/30";
  const glow    = isFake ? "from-rose-500/8"        : "from-emerald-500/8";
  const badge   = isFake ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                         : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  const bar     = isFake ? "from-rose-500 to-rose-400"
                         : "from-emerald-500 to-emerald-400";

  const fmt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const ts = result.timestamp ? fmt.format(new Date(result.timestamp)) : "—";

  return (
    <div className={`relative mt-6 bg-white/[0.03] border ${border} rounded-2xl p-6 sm:p-8 overflow-hidden transition-all duration-500`}>
      {/* subtle gradient overlay */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glow} to-transparent rounded-2xl`} />

      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-5">
          Analysis Result
        </p>

        {/* Top row: verdict badge + score */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className={`inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl border ${badge}`}>
            {isFake ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {result.label} Review
          </span>

          <span className="text-slate-400 text-sm">
            Confidence:{" "}
            <strong className="text-white tabular-nums">
              {scorePercent}%
            </strong>
          </span>
        </div>

        {/* Confidence bar */}
        <div className="mb-6">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-600 font-semibold mb-2">
            <span>Confidence Score</span>
            <span>{scorePercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${bar} transition-all duration-1000 ease-out`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        {/* Review text preview */}
        <div className="mb-5">
          <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold mb-2">Review</p>
          <p className="text-slate-300 text-sm leading-relaxed bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 line-clamp-5">
            {result.text}
          </p>
        </div>

        {/* Timestamp */}
        <div className={`pt-4 border-t border-white/[0.05] flex items-center gap-2 text-[11px] text-slate-600`}>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {ts}
        </div>
      </div>
    </div>
  );
}