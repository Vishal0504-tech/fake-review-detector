"use client";

import { useEffect, useState } from "react";
import { getDashboardData, getTimeAnalysis } from "@/services/api";
import Navbar from "@/components/Navbar";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {

  // ✅ ALL HOOKS AT TOP
  const [data, setData] = useState(null);
  const [trendData, setTrendData] = useState([]);

  // ✅ SINGLE useEffect
  useEffect(() => {
    getDashboardData().then(setData);
    getTimeAnalysis().then(setTrendData);
  }, []);

  // 🔄 Loading UI
  if (!data) {
    return (
      <div className="min-h-screen bg-[#070c18] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  // 📊 Chart Data
  const pieData = [
    { name: "Fake", value: data.fake_reviews || 0 },
    { name: "Real", value: data.real_reviews || 0 },
  ];

  const barData = [
    { name: "Total", value: data.total_reviews || 0 },
    { name: "Fake", value: data.fake_reviews || 0 },
    { name: "Real", value: data.real_reviews || 0 },
  ];

  return (
    <div className="min-h-screen bg-[#070c18]">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6">

        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-8">
          Dashboard Analytics
        </h1>

        {/* 🔥 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">Total</p>
            <h2 className="text-white text-2xl font-bold">
              {data.total_reviews}
            </h2>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">Fake</p>
            <h2 className="text-red-400 text-2xl font-bold">
              {data.fake_reviews}
            </h2>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">Real</p>
            <h2 className="text-green-400 text-2xl font-bold">
              {data.real_reviews}
            </h2>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">Fake %</p>
            <h2 className="text-yellow-400 text-2xl font-bold">
              {data.fake_percentage}%
            </h2>
          </div>

        </div>

        {/* 📊 Charts Section */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* 🔵 Pie Chart */}
          <div className="bg-white/5 p-6 rounded-xl">
            <h2 className="text-white mb-4">Fake vs Real</h2>

            <PieChart width={300} height={300}>
              <Pie data={pieData} dataKey="value" outerRadius={100}>
                <Cell fill="#ff4d4f" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* 📊 Bar Chart */}
          <div className="bg-white/5 p-6 rounded-xl">
            <h2 className="text-white mb-4">Review Distribution</h2>

            <BarChart width={400} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#38bdf8" />
            </BarChart>
          </div>

        </div>

        {/* 📈 Time Trend Chart */}
        <div className="bg-white/5 p-6 rounded-xl mt-10">
          <h2 className="text-white mb-4">
            Review Trend (Time Analysis)
          </h2>

          <LineChart width={600} height={300} data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />

            <Line type="monotone" dataKey="total" stroke="#38bdf8" />
            <Line type="monotone" dataKey="fake" stroke="#ef4444" />
          </LineChart>
        </div>

      </main>
    </div>
  );
}