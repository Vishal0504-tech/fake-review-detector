"use client";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/services/api";
import Navbar from "@/components/Navbar";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

  if (!data)
    return (
      <div className="min-h-screen bg-[#070c18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
            Loading
          </p>
        </div>
      </div>
    );

  const pieData = [
    { name: "Fake", value: data.fake_percentage },
    { name: "Real", value: 100 - data.fake_percentage },
  ];

  const barData = [
    { name: "Reviews", value: data.total_reviews },
    { name: "Users", value: data.suspicious_users },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0e1628] border border-white/[0.08] rounded-xl px-4 py-3 shadow-xl">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">
            {label || payload[0].name}
          </p>
          <p className="text-lg font-bold text-white tabular-nums">
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#070c18]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/70 font-semibold mb-1">
            Overview
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pie Chart card */}
          <div className="group bg-white/[0.03] border border-white/[0.07] hover:border-rose-500/25 rounded-2xl p-6 sm:p-8 transition-all duration-300">
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1">
                Composition
              </p>
              <h2 className="text-base font-bold text-white tracking-tight">
                Fake vs Real Reviews
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <PieChart width={200} height={200}>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={85}
                    innerRadius={50}
                    strokeWidth={0}
                  >
                    <Cell fill="#f43f5e" />
                    <Cell fill="#10b981" />
                  </Pie>
                </PieChart>
              </div>

              {/* Legend */}
              <div className="flex flex-row sm:flex-col gap-4 sm:gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Fake</p>
                    <p className="text-xl font-bold text-rose-400 tabular-nums">{data.fake_percentage}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Real</p>
                    <p className="text-xl font-bold text-emerald-400 tabular-nums">{100 - data.fake_percentage}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 h-px bg-gradient-to-r from-rose-500/30 to-transparent" />
          </div>

          {/* Bar Chart card */}
          <div className="group bg-white/[0.03] border border-white/[0.07] hover:border-cyan-500/25 rounded-2xl p-6 sm:p-8 transition-all duration-300">
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1">
                Volume
              </p>
              <h2 className="text-base font-bold text-white tracking-tight">
                Reviews & Suspicious Users
              </h2>
            </div>

            <div className="w-full overflow-x-auto">
              <BarChart
                width={340}
                height={200}
                data={barData}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#475569", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </div>

            <div className="mt-6 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
          </div>

        </div>
      </main>
    </div>
  );
}