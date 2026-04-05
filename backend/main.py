import sys
import os

sys.path.append(os.path.dirname(__file__))

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from models.predictor import predict_review
from db import collection
from datetime import datetime
from collections import defaultdict

app = FastAPI(title="Fake Review Detector API", version="2.0.0")

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# 📦 MODEL — text only, no product
# ==============================

class Review(BaseModel):
    text: str


# ==============================
# 🏠 HOME
# ==============================

@app.get("/")
def home():
    return {"message": "Fake Review Detector API is running 🚀"}


# ==============================
# 📊 DASHBOARD STATS
# ==============================

@app.get("/dashboard")
def dashboard():
    total = collection.count_documents({})
    fake  = collection.count_documents({"label": "Fake"})
    real  = collection.count_documents({"label": "Real"})
    fake_percentage = (fake / total * 100) if total > 0 else 0

    return {
        "total_reviews": total,
        "fake_reviews": fake,
        "real_reviews": real,
        "fake_percentage": round(fake_percentage, 2),
    }


# ==============================
# 🤖 ANALYZE REVIEW
# ==============================

@app.post("/analyze")
def analyze(review: Review):
    result = predict_review(review.text)

    timestamp = datetime.now()

    data = {
        "text": review.text,
        "score": result["score"],
        "label": result["label"],
        "timestamp": timestamp,
    }

    collection.insert_one(data)

    return {
        "text": review.text,
        "label": result["label"],
        "score": round(result["score"], 4),
        "timestamp": timestamp.isoformat(),
    }


# ==============================
# 📄 ALL REVIEWS (history)
# ==============================

@app.get("/reviews")
def get_reviews():
    raw = list(collection.find({}, {"_id": 0}))
    # Convert datetime to ISO string for JSON serialization
    for r in raw:
        if isinstance(r.get("timestamp"), datetime):
            r["timestamp"] = r["timestamp"].isoformat()
    return raw


# ==============================
# ⏱ TIME ANALYSIS
# ==============================

@app.get("/time-analysis")
def time_analysis():
    data = list(collection.find({}, {"_id": 0}))

    daily_data = defaultdict(lambda: {"total": 0, "fake": 0})

    for item in data:
        ts = item.get("timestamp")
        if isinstance(ts, datetime):
            date = ts.strftime("%Y-%m-%d")
        else:
            date = str(ts)[:10]

        daily_data[date]["total"] += 1

        if item["label"] == "Fake":
            daily_data[date]["fake"] += 1

    result = []
    for date, values in daily_data.items():
        result.append({
            "date": date,
            "total": values["total"],
            "fake": values["fake"],
        })

    return sorted(result, key=lambda x: x["date"])


# ==============================
# 🚨 ALERTS
# ==============================

@app.get("/alerts")
def alerts():
    data = list(collection.find({}, {"_id": 0}))

    result = []

    total = len(data)
    fake  = sum(1 for d in data if d["label"] == "Fake")

    if total > 0 and (fake / total) > 0.4:
        result.append({"type": "Fraud", "msg": "High fake review percentage detected 🚨"})

    daily = {}
    for d in data:
        ts = d.get("timestamp")
        date = ts.strftime("%Y-%m-%d") if isinstance(ts, datetime) else str(ts)[:10]
        daily[date] = daily.get(date, 0) + 1

    for date, count in daily.items():
        if count > 10:
            result.append({"type": "Spike", "msg": f"Review spike on {date} 📈"})

    return result