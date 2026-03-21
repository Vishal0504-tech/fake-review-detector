"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getAlerts } from "@/services/api";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Auto refresh every 5 sec
  useEffect(() => {
    const fetchAlerts = () => {
      getAlerts()
        .then((data) => {
          setAlerts(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);

    return () => clearInterval(interval);
  }, []);

  // 🎨 Alert styles based on type
  const getAlertStyle = (type) => {
    switch (type) {
      case "Fraud":
        return {
          bg: "bg-rose-500/[0.05]",
          border: "border-rose-500/20",
          text: "text-rose-400",
        };
      case "Spike":
        return {
          bg: "bg-amber-500/[0.05]",
          border: "border-amber-500/20",
          text: "text-amber-400",
        };
      default:
        return {
          bg: "bg-cyan-500/[0.05]",
          border: "border-cyan-500/20",
          text: "text-cyan-400",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#070c18]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-10 flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase text-rose-500/70">
              System
            </p>
            <h1 className="text-2xl text-white font-bold">
              Alerts
            </h1>
          </div>

          {alerts.length > 0 && (
            <span className="text-xs text-rose-400">
              {alerts.length} Active 🚨
            </span>
          )}
        </div>

        {/* 🔄 Loading */}
        {loading && (
          <p className="text-slate-400">Loading alerts...</p>
        )}

        {/* ✅ Empty */}
        {!loading && alerts.length === 0 && (
          <div className="text-center text-emerald-400">
            No alerts ✅
          </div>
        )}

        {/* 🚨 Alerts */}
        <div className="flex flex-col gap-4">
          {alerts.map((alert, i) => {
            const style = getAlertStyle(alert.type);

            return (
              <div
                key={i}
                className={`p-5 rounded-xl border ${style.bg} ${style.border}`}
              >
                <div className="flex justify-between items-start">

                  {/* Message */}
                  <div>
                    <p className={`font-semibold ${style.text}`}>
                      {alert.type}
                    </p>

                    <p className="text-slate-300 text-sm">
                      {alert.message}
                    </p>
                  </div>

                  {/* Time */}
                  {alert.time && (
                    <p className="text-xs text-slate-500">
                      {alert.time}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}