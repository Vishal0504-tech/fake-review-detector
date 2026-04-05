"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getAllReviews } from "@/services/api";

export default function HistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState("All"); // All | Fake | Real

  useEffect(() => {
    getAllReviews()
      .then((data) => setReviews([...data].reverse()))
      .catch(() => setError("Could not load review history."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All"
    ? reviews
    : reviews.filter((r) => r.label === filter);

  const fake  = reviews.filter((r) => r.label === "Fake").length;
  const real  = reviews.filter((r) => r.label === "Real").length;

  const fmt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-[#070c18]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/70 font-semibold mb-1">
            Database
          </p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Review History
          </h1>
          <p className="text-slate-500 text-sm mt-1">All analyzed reviews stored in the database.</p>
        </div>

        {/* Summary pills */}
        {!loading && !error && (
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { label: "All",  count: reviews.length, color: "cyan"    },
              { label: "Fake", count: fake,            color: "rose"    },
              { label: "Real", count: real,            color: "emerald" },
            ].map(({ label, count, color }) => {
              const active = filter === label;
              const colors = {
                cyan:    active ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"    : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20",
                rose:    active ? "bg-rose-500/20 border-rose-500/50 text-rose-300"    : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20",
                emerald: active ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20",
              };
              return (
                <button
                  key={label}
                  onClick={() => setFilter(label)}
                  className={`text-[11px] font-semibold uppercase tracking-widest px-4 py-2 rounded-lg border transition-all duration-200 ${colors[color]}`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-slate-700 border-t-cyan-400 animate-spin" />
            <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold">Loading…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-rose-400 text-sm">
            ⚠ {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl mb-2">
              📭
            </div>
            <p className="text-white font-semibold">No reviews yet</p>
            <p className="text-slate-500 text-sm max-w-xs">
              {filter === "All"
                ? "Analyze a review on the home page and it will appear here."
                : `No ${filter} reviews found.`}
            </p>
          </div>
        )}

        {/* Review List */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((review, idx) => {
              const isFake  = review.label === "Fake";
              const border  = isFake ? "border-rose-500/20 hover:border-rose-500/40"    : "border-emerald-500/20 hover:border-emerald-500/40";
              const badge   = isFake ? "bg-rose-500/15 text-rose-400 border-rose-500/30" : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
              const score   = Math.round((review.score ?? 0) * 100);
              const ts      = review.timestamp ? fmt.format(new Date(review.timestamp)) : "—";

              return (
                <div
                  key={idx}
                  className={`group bg-white/[0.025] border ${border} rounded-2xl px-5 py-4 transition-all duration-200 hover:bg-white/[0.04]`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">

                    {/* Review text */}
                    <p className="text-slate-300 text-sm leading-relaxed flex-1 min-w-0 line-clamp-2">
                      {review.text}
                    </p>

                    {/* Right side: badge + score + time */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg border ${badge}`}>
                        {review.label}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold tabular-nums">
                        {score}% confidence
                      </span>
                      <span className="text-[10px] text-slate-600 tabular-nums">{ts}</span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
