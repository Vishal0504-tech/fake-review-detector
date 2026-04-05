"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getDashboardData, getTimeAnalysis } from "@/services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ── Custom tooltip for recharts ────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1426] border border-white/[0.1] rounded-xl px-4 py-3 shadow-2xl text-sm">
      {label && <p className="text-slate-400 mb-1 font-semibold">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [stats, setStats]     = useState(null);
  const [trend, setTrend]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    Promise.all([getDashboardData(), getTimeAnalysis()])
      .then(([s, t]) => { setStats(s); setTrend(t); })
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070c18]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-slate-700 border-t-cyan-400 animate-spin" />
          <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold">
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#070c18]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-rose-400 text-sm">
            ⚠ {error}
          </div>
        </div>
      </div>
    );
  }

  /* ── Chart data ── */
  const pieData = [
    { name: "Fake", value: stats.fake_reviews   || 0 },
    { name: "Real", value: stats.real_reviews    || 0 },
  ];

  const barData = [
    { name: "Total", value: stats.total_reviews || 0 },
    { name: "Fake",  value: stats.fake_reviews  || 0 },
    { name: "Real",  value: stats.real_reviews  || 0 },
  ];

  const PIE_COLORS  = ["#f43f5e", "#22c55e"];
  const BAR_COLORS  = ["#38bdf8", "#f43f5e", "#22c55e"];

  return (
    <div className="min-h-screen bg-[#070c18]">
      <Navbar />

      {/* ── Background glow ── */}
      <div className="pointer-events-none fixed inset-0 flex items-start justify-center overflow-hidden">
        <div className="w-[700px] h-[350px] mt-20 rounded-full bg-cyan-500/8 blur-[140px]" />
      </div>

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/70 font-semibold mb-1">
            Overview
          </p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Dashboard Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time statistics from all analyzed reviews.
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Total Reviews",
              value: stats.total_reviews,
              color:  "text-white",
              bg:     "from-cyan-500/10 to-transparent",
              border: "border-cyan-500/20",
              icon: (
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
            },
            {
              label: "Fake Reviews",
              value: stats.fake_reviews,
              color:  "text-rose-400",
              bg:     "from-rose-500/10 to-transparent",
              border: "border-rose-500/20",
              icon: (
                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              ),
            },
            {
              label: "Real Reviews",
              value: stats.real_reviews,
              color:  "text-emerald-400",
              bg:     "from-emerald-500/10 to-transparent",
              border: "border-emerald-500/20",
              icon: (
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              label: "Fake Rate",
              value: `${stats.fake_percentage}%`,
              color:  "text-amber-400",
              bg:     "from-amber-500/10 to-transparent",
              border: "border-amber-500/20",
              icon: (
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              ),
            },
          ].map(({ label, value, color, bg, border, icon }) => (
            <div
              key={label}
              className={`relative overflow-hidden bg-gradient-to-br ${bg} border ${border} rounded-2xl p-5 backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  {label}
                </p>
                <div className="p-1.5 rounded-lg bg-white/[0.05]">{icon}</div>
              </div>
              <p className={`text-3xl font-extrabold tabular-nums ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* Pie Chart */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">
              Distribution
            </p>
            <h2 className="text-white font-bold mb-5">Fake vs Real</h2>

            {stats.total_reviews === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => (
                      <span className="text-slate-400 text-xs">{v}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">
              Volume
            </p>
            <h2 className="text-white font-bold mb-5">Review Breakdown</h2>

            {stats.total_reviews === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Trend Line Chart ── */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">
            Time Series
          </p>
          <h2 className="text-white font-bold mb-5">Review Trend</h2>

          {trend.length === 0 ? (
            <EmptyChart label="No trend data yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span className="text-slate-400 text-xs capitalize">{v}</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ fill: "#38bdf8", r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="fake"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={{ fill: "#f43f5e", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </main>
    </div>
  );
}

/* ── Empty chart placeholder ── */
function EmptyChart({ label = "No data yet" }) {
  return (
    <div className="flex flex-col items-center justify-center h-[240px] gap-3 text-center">
      <p className="text-3xl">📊</p>
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-slate-600 text-xs">Analyze some reviews first.</p>
    </div>
  );
}
