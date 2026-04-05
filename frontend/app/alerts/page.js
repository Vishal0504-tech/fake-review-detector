"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getAlerts, getDashboardData } from "@/services/api";

export default function AlertsPage() {
  const [alerts, setAlerts]   = useState([]);
  const [stats,  setStats]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    Promise.all([getAlerts(), getDashboardData()])
      .then(([a, s]) => { setAlerts(a); setStats(s); })
      .catch(() => setError("Could not load alerts."))
      .finally(() => setLoading(false));
  }, []);

  const typeConfig = {
    Fraud: { icon: "🚨", color: "rose",    border: "border-rose-500/30 bg-rose-500/5",    text: "text-rose-400", badge: "bg-rose-500/20 border-rose-500/40 text-rose-300" },
    Spike: { icon: "📈", color: "amber",   border: "border-amber-500/30 bg-amber-500/5",  text: "text-amber-400", badge: "bg-amber-500/20 border-amber-500/40 text-amber-300" },
  };

  return (
    <div className="min-h-screen bg-[#070c18]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/70 font-semibold mb-1">
            Monitoring
          </p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Alerts</h1>
          <p className="text-slate-500 text-sm mt-1">Automated fraud signals and anomalies.</p>
        </div>

        {/* Stats mini-row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Total Reviews", value: stats.total_reviews, color: "text-cyan-400" },
              { label: "Fake",          value: stats.fake_reviews,  color: "text-rose-400" },
              { label: "Real",          value: stats.real_reviews,  color: "text-emerald-400" },
              { label: "Fake Rate",     value: `${stats.fake_percentage}%`, color: "text-amber-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">{label}</p>
                <p className={`text-2xl font-extrabold tabular-nums ${color}`}>{value}</p>
              </div>
            ))}
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

        {/* All clear */}
        {!loading && !error && alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl mb-2">
              ✅
            </div>
            <p className="text-white font-semibold text-lg">All Clear</p>
            <p className="text-slate-500 text-sm">No suspicious patterns detected in the current dataset.</p>
          </div>
        )}

        {/* Alert list */}
        {!loading && !error && alerts.length > 0 && (
          <div className="space-y-4">
            {alerts.map((alert, idx) => {
              const cfg = typeConfig[alert.type] ?? typeConfig.Fraud;
              return (
                <div
                  key={idx}
                  className={`border ${cfg.border} rounded-2xl px-6 py-5 flex items-start gap-4`}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${cfg.badge}`}>
                        {alert.type}
                      </span>
                    </div>
                    <p className={`text-sm font-medium ${cfg.text}`}>{alert.msg}</p>
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