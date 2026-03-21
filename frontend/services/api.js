const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔹 Dashboard
export const getDashboardData = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`, { cache: "no-store" });
  return res.json();
};

// 🔹 Review Analysis
export const analyzeReview = async (text, product) => {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, product }),
  });

  return res.json();
};

// 🔹 Product Data
export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`, { cache: "no-store" });
  return res.json();
};

export const getProductStats = async () => {
  const res = await fetch(`${BASE_URL}/product-stats`);
  return res.json();
};

// 🔹 User Data
export const getUserData = async () => {
  const res = await fetch(`${BASE_URL}/users`, { cache: "no-store" });
  return res.json();
};

// 🔹 Network Data
export const getNetworkData = async () => {
  const res = await fetch(`${BASE_URL}/network`, { cache: "no-store" });
  return res.json();
};

// 🔹 Alerts
export const getAlerts = async () => {
  const res = await fetch(`${BASE_URL}/alerts`, { cache: "no-store" });
  return res.json();
};

// 🔹 Reviews
export const getAllReviews = async () => {
  const res = await fetch(`${BASE_URL}/reviews`);
  return res.json();
};

// 🔹 Time Analysis
export const getTimeAnalysis = async () => {
  const res = await fetch(`${BASE_URL}/time-analysis`, { cache: "no-store" });
  return res.json();
};

// 🔹 Trend
export const getTrendData = async () => {
  const res = await fetch(`${BASE_URL}/trend`);
  return res.json();
};