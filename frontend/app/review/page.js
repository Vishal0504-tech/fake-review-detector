"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { analyzeReview } from "@/services/api";

export default function ReviewPage() {
  const [text, setText] = useState("");
  const [product, setProduct] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const res = await analyzeReview(text, product);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070c18]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/70 font-semibold mb-1">
            Detection
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Real-Time Review Detection
          </h1>
        </div>

        <label className="block text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-3 mt-4">
  Product Name
</label>

<input
  type="text"
  placeholder="Enter product name (e.g., iPhone, Shoes)"
  value={product}
  onChange={(e) => setProduct(e.target.value)}
  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
/>

        {/* Input card */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 sm:p-8">
          <label className="block text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-3">
            Review Text
          </label>
          <textarea
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all duration-200 min-h-[140px]"
            placeholder="Paste or type a review to analyze…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleAnalyze}
             disabled={loading || !text.trim() || !product.trim()}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/30 disabled:cursor-not-allowed text-[#070c18] disabled:text-cyan-900 font-bold text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-cyan-900/40 border-t-current animate-spin" />
                  Analyzing
                </>
              ) : (
                "Analyze"
              )}
            </button>

            {loading && (
              <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold animate-pulse">
                Processing…
              </p>
            )}
          </div>
        </div>

        {/* Result card */}
        {result && (
          <div className={`mt-6 bg-white/[0.03] border rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
            result.label === "Fake"
              ? "border-rose-500/30"
              : "border-emerald-500/30"
          }`}>
            <div className={`absolute inset-0 rounded-2xl pointer-events-none ${
              result.label === "Fake"
                ? "bg-gradient-to-br from-rose-500/5 to-transparent"
                : "bg-gradient-to-br from-emerald-500/5 to-transparent"
            }`} />

            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-5">
              Analysis Result
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Score */}
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600 font-semibold mb-1">
                  Score
                </p>
                <p className="text-4xl font-bold text-white tabular-nums">
                  {result.score}
                </p>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-12 bg-white/[0.07]" />

              {/* Label */}
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600 font-semibold mb-1">
                  Verdict
                </p>
                <p className={`text-2xl font-bold tracking-tight ${
                  result.label === "Fake"
                    ? "text-rose-400"
                    : "text-emerald-400"
                }`}>
                  {result.label}
                </p>
              </div>
            </div>

            <div className={`mt-6 h-px bg-gradient-to-r to-transparent ${
              result.label === "Fake"
                ? "from-rose-500/40"
                : "from-emerald-500/40"
            }`} />
          </div>
        )}

      </main>
    </div>
  );
}