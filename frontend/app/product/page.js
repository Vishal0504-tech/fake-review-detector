"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔥 Fetch products
  useEffect(() => {
    fetch("https://fake-review-detector-2-mk9o.onrender.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // 🎨 Risk styles
  const getRiskColor = (percent) => {
    if (percent >= 50)
      return {
        bar: "bg-rose-500",
        text: "text-rose-400",
        border: "group-hover:border-rose-500/30",
        gradient: "from-rose-500/5",
        accent: "from-rose-500/40",
        badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        label: "High Risk 🚨",
        insight: "High fake activity detected",
      };

    if (percent >= 25)
      return {
        bar: "bg-amber-500",
        text: "text-amber-400",
        border: "group-hover:border-amber-500/30",
        gradient: "from-amber-500/5",
        accent: "from-amber-500/40",
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        label: "Medium Risk ⚠️",
        insight: "Moderate suspicious activity",
      };

    return {
      bar: "bg-emerald-500",
      text: "text-emerald-400",
      border: "group-hover:border-emerald-500/30",
      gradient: "from-emerald-500/5",
      accent: "from-emerald-500/40",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      label: "Low Risk ✅",
      insight: "Looks trustworthy",
    };
  };

  return (
    <div className="min-h-screen bg-[#070c18]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/70 font-semibold mb-1">
            Catalog
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Products
          </h1>
        </div>

        {/* 🔄 Loading Skeleton */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-white/5 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        )}

        {/* ❌ Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            No products found 🚫 <br />
            <span className="text-xs">
              Try adding reviews first
            </span>
          </div>
        )}

        {/* 🔥 Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => {
              const percent =
                p.total > 0 ? (p.fake / p.total) * 100 : 0;

              const risk = getRiskColor(percent);

              return (
                <div
                  key={i}
                  onClick={() =>
                    router.push(`/product/${encodeURIComponent(p.name)}`)
                  }
                  className={`cursor-pointer group relative bg-white/[0.03] border border-white/[0.07] ${risk.border} rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300`}
                >

                  {/* 🖼 Image */}
                  <img
                    src={p.image}
                    alt={p.name}
                    onError={(e) =>
                      (e.target.src =
                        "https://dummyimage.com/400x300/111827/ffffff&text=No+Image")
                    }
                    className="w-full h-40 object-cover"
                  />

                  {/* Hover gradient */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${risk.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* 🔥 AI Insight overlay (on hover) */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 opacity-0 group-hover:opacity-100 transition text-xs text-white">
                    🤖 {risk.insight}
                  </div>

                  {/* Content */}
                  <div className="p-5 relative">

                    {/* Title + badge */}
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-white font-bold text-lg truncate">
                        {p.name}
                      </h2>

                      <span
                        className={`text-[10px] px-2 py-1 rounded-full border ${risk.badge}`}
                      >
                        {risk.label}
                      </span>
                    </div>

                    {/* Stats */}
                    <p className="text-xs text-slate-400 mb-3">
                      Total: {p.total} | Fake: {p.fake}
                    </p>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`${risk.bar} h-full transition-all duration-500`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <span
                        className={`text-xs font-semibold ${risk.text}`}
                      >
                        {percent.toFixed(1)}%
                      </span>
                    </div>

                  </div>

                  {/* Bottom glow */}
                  <div
                    className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r ${risk.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}