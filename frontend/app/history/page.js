"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getAllReviews } from "@/services/api";

export default function HistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getAllReviews()
      .then((data) => setReviews([...data].reverse()))
      .catch(() => setError("Could not load review history."))
      .finally(() => setLoading(false));
  }, []);

  // ✅ FIXED DELETE FUNCTION
  const handleDelete = async (id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete/${id}`, {
        method: "DELETE",
      });

      // ✅ update UI correctly
      setReviews((prev) => prev.filter((item) => item._id !== id));

    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filtered =
    filter === "All"
      ? reviews
      : reviews.filter((r) => r.label === filter);

  return (
    <div className="min-h-screen bg-[#070c18]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">
            Review History
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            All analyzed reviews stored in the database.
          </p>
        </div>

        {/* Filters */}
        {!loading && !error && (
          <div className="flex gap-3 mb-6">
            {["All", "Fake", "Real"].map((label) => (
              <button
                key={label}
                onClick={() => setFilter(label)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filter === label
                    ? "bg-cyan-500 text-white"
                    : "bg-white/10 text-gray-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && <p className="text-gray-400">Loading...</p>}

        {/* Error */}
        {error && <p className="text-red-400">{error}</p>}

        {/* List */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((review) => {
              const isFake = review.label === "Fake";
              const score = Math.round((review.score ?? 0) * 100);

              return (
                <div
                  key={review._id} // ✅ FIXED KEY
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-start"
                >
                  {/* Text */}
                  <div className="flex-1">
                    <p className="text-white text-sm mb-2">
                      {review.text}
                    </p>

                    <p
                      className={`text-xs ${
                        isFake ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {review.label} • {score}%
                    </p>
                  </div>

                  {/* ✅ FIXED DELETE BUTTON */}
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-red-400 text-xs hover:text-red-300 ml-4"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            No reviews found.
          </p>
        )}
      </main>
    </div>
  );
}