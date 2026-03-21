const BASE_URL = "http://127.0.0.1:8000";

// 🔹 Dashboard
export const getDashboardData = async () => {
  try {
    const res = await fetch(`${BASE_URL}/dashboard`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Dashboard API error");

    return await res.json();
  } catch (err) {
    console.error("Dashboard Fetch Error:", err);
    return null;
  }
};

// 🔹 Review Analysis
export const analyzeReview = async (text, product) => {
  try {
    const res = await fetch(`${BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        text,
        product   // ✅ NEW
      }),
    });

    if (!res.ok) throw new Error("Analyze API error");

    return await res.json();
  } catch (err) {
    console.error("Analyze Error:", err);
    return null;
  }
};

// 🔹 Product Data
export const getProducts = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/products", {
      cache: "no-store",
    });

    return await res.json();
  } catch (err) {
    console.error("Products Fetch Error:", err);
    return [];
  }
};
// 🔹 User Data
export const getUserData = async () => {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("User API error");

    return await res.json();
  } catch (err) {
    console.error("User Fetch Error:", err);
    return null;
  }
};

// 🔹 Network Data
export const getNetworkData = async () => {
  try {
    const res = await fetch(`${BASE_URL}/network`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Network API error");

    return await res.json();
  } catch (err) {
    console.error("Network Fetch Error:", err);
    return null;
  }
};

// 🔹 Alerts
export const getAlerts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/alerts`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Alerts API error");

    return await res.json();
  } catch (err) {
    console.error("Alerts Fetch Error:", err);
    return null;
  }
};

export const getAllReviews = async () => {
  const res = await fetch("http://127.0.0.1:8000/reviews");
  return res.json();
};

export const getTimeAnalysis = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/time-analysis", {
      cache: "no-store",
    });

    return await res.json();
  } catch (err) {
    console.error("Time Analysis Error:", err);
    return [];
  }
};