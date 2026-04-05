const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// 🔹 Analyze a review (text only — no product)
export const analyzeReview = async (text) => {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to analyze review");
  return res.json();
};

// 🔹 Fetch all reviews (history)
export const getAllReviews = async () => {
  const res = await fetch(`${BASE_URL}/reviews`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

// 🔹 Dashboard stats
export const getDashboardData = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch dashboard");
  return res.json();
};

// 🔹 Time analysis trend
export const getTimeAnalysis = async () => {
  const res = await fetch(`${BASE_URL}/time-analysis`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch time analysis");
  return res.json();
};

// 🔹 Alerts
export const getAlerts = async () => {
  const res = await fetch(`${BASE_URL}/alerts`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
};

export const deleteReview = async (id) => {
  const res = await fetch(`${BASE_URL}/delete-review/${id}`, {
    method: "DELETE",
  });

  return res.json();
};