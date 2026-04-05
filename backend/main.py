import sys
import os

sys.path.append(os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException  # ✅ FIXED
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from models.predictor import predict_review
from db import collection
from datetime import datetime
from collections import defaultdict
from bson import ObjectId  # ✅ REQUIRED

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
# 📦 MODEL
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
# 📊 DASHBOARD
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
# 🤖 ANALYZE
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

    inserted = collection.insert_one(data)

    return {
        "_id": str(inserted.inserted_id),  # ✅ send id
        "text": review.text,
        "label": result["label"],
        "score": round(result["score"], 4),
        "timestamp": timestamp.isoformat(),
    }


# ==============================
# 📄 ALL REVIEWS
# ==============================

@app.get("/reviews")
def get_reviews():
    raw = list(collection.find())

    result = []
    for r in raw:
        result.append({
            "_id": str(r["_id"]),  # ✅ REQUIRED for delete
            "text": r["text"],
            "label": r["label"],
            "score": r.get("score", 0),
            "timestamp": r["timestamp"].isoformat() if isinstance(r.get("timestamp"), datetime) else None
        })

    return result


# ==============================
# 🗑 DELETE REVIEW
# ==============================

@app.delete("/delete-review/{review_id}")
def delete_review(review_id: str):
    try:
        result = collection.delete_one({"_id": ObjectId(review_id)})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Review not found")

        return {"message": "Deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==============================
# ⏱ TIME ANALYSIS
# ==============================

@app.get("/time-analysis")
def time_analysis():
    data = list(collection.find())

    daily_data = defaultdict(lambda: {"total": 0, "fake": 0})

    for item in data:
        ts = item.get("timestamp")
        date = ts.strftime("%Y-%m-%d") if isinstance(ts, datetime) else str(ts)[:10]

        daily_data[date]["total"] += 1

        if item["label"] == "Fake":
            daily_data[date]["fake"] += 1

    return sorted([
        {"date": d, "total": v["total"], "fake": v["fake"]}
        for d, v in daily_data.items()
    ], key=lambda x: x["date"])


# ==============================
# 🚨 ALERTS
# ==============================

@app.get("/alerts")
def alerts():
    data = list(collection.find())

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

@app.delete("/delete/{id}")
def delete_review(id: str):
    result = collection.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")

    return {"message": "Deleted successfully"}