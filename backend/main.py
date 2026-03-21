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

app = FastAPI()

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
    product: str


# ==============================
# 📊 DASHBOARD
# ==============================

@app.get("/")
def home():
    return {"message": "Backend is running successfully 🚀"}

@app.get("/dashboard")
def dashboard():
    total = collection.count_documents({})
    fake = collection.count_documents({"label": "Fake"})
    real = collection.count_documents({"label": "Real"})

    fake_percentage = (fake / total * 100) if total > 0 else 0

    return {
        "total_reviews": total,
        "fake_reviews": fake,
        "real_reviews": real,
        "fake_percentage": round(fake_percentage, 2)
    }


# ==============================
# 🤖 ANALYZE REVIEW
# ==============================

@app.post("/analyze")
def analyze(review: Review):
    result = predict_review(review.text)

    data = {
        "text": review.text,
        "product": review.product,
        "score": result["score"],
        "label": result["label"],
        "timestamp": datetime.now()
    }

    collection.insert_one(data)

    return result


# ==============================
# ⏱ TIME ANALYSIS
# ==============================

@app.get("/time-analysis")
def time_analysis():
    data = list(collection.find({}, {"_id": 0}))

    daily_data = defaultdict(lambda: {"total": 0, "fake": 0})

    for item in data:
        date = item["timestamp"].strftime("%Y-%m-%d")

        daily_data[date]["total"] += 1

        if item["label"] == "Fake":
            daily_data[date]["fake"] += 1

    result = []

    for date, values in daily_data.items():
        result.append({
            "date": date,
            "total": values["total"],
            "fake": values["fake"]
        })

    return sorted(result, key=lambda x: x["date"])


# ==============================
# 📦 PRODUCTS (AGGREGATED)
# ==============================

@app.get("/products")
def get_products():
    pipeline = [
        {
            "$group": {
                "_id": "$product",
                "total": {"$sum": 1},
                "fake": {
                    "$sum": {
                        "$cond": [{"$eq": ["$label", "Fake"]}, 1, 0]
                    }
                }
            }
        }
    ]

    result = list(collection.aggregate(pipeline))

    products = []

    for item in result:
        name = item["_id"]
        total = item["total"]
        fake = item["fake"]

        products.append({
            "name": name,
            "total": total,
            "fake": fake,
            "image": f"https://dummyimage.com/400x300/0f172a/ffffff&text={name}"
        })

    return products


# ==============================
# 🔍 PRODUCT DETAIL (NEW 🔥)
# ==============================

@app.get("/product/{name}")
def get_product_detail(name: str):
    reviews = list(collection.find({"product": name}, {"_id": 0}))

    total = len(reviews)
    fake = sum(1 for r in reviews if r["label"] == "Fake")
    real = total - fake

    fake_percent = (fake / total * 100) if total > 0 else 0

    insights = []

    # 🚨 High fake %
    if fake_percent > 60:
        insights.append("🚨 High fake review percentage detected")

    elif fake_percent > 30:
        insights.append("⚠ Moderate fake activity detected")

    else:
        insights.append("✅ Product appears trustworthy")

    # 📈 Spike detection
    daily = {}
    for r in reviews:
        date = r["timestamp"].strftime("%Y-%m-%d")
        daily[date] = daily.get(date, 0) + 1

    for count in daily.values():
        if count > 5:
            insights.append("📈 Sudden spike in reviews detected")
            break

    # 🤖 Bot detection (simple logic)
    if fake > 3 and fake_percent > 50:
        insights.append("🤖 Possible bot-generated reviews")

    return {
        "name": name,
        "total": total,
        "fake": fake,
        "real": real,
        "fake_percent": round(fake_percent, 2),
        "insights": insights,
        "reviews": reviews,
        "image": f"https://dummyimage.com/600x400/0f172a/ffffff&text={name}"
    }


# ==============================
 

@app.get("/product-stats")
def product_stats():
    reviews = list(collection.find())

    stats = defaultdict(lambda: {"fake": 0, "real": 0})

    for r in reviews:
        product = r.get("product", "Unknown")

        if r["label"] == "Fake":
            stats[product]["fake"] += 1
        else:
            stats[product]["real"] += 1

    result = []
    for product, values in stats.items():
        result.append({
            "product": product,
            "fake": values["fake"],
            "real": values["real"]
        })

    return result
# ==============================

@app.get("/users")
def users():
    return [
        {"name": "User1", "total_reviews": 20, "fake_score": 0.8},
        {"name": "User2", "total_reviews": 5, "fake_score": 0.2}
    ]


# ==============================
# 🔗 NETWORK (DUMMY)
# ==============================

@app.get("/network")
def network():
    data = list(collection.find({}, {"_id": 0}))

    nodes = set()
    edges = []

    for item in data:
        user = item.get("user", "Anonymous")
        product = item.get("product", "Unknown")

        nodes.add(user)
        nodes.add(product)

        edges.append({"source": user, "target": product})

    return {
        "nodes": list(nodes),
        "edges": edges
    }


# ==============================
# 🚨 ALERTS
# ==============================

@app.get("/alerts")
def alerts():
    data = list(collection.find({}, {"_id": 0}))

    alerts = []

    total = len(data)
    fake = sum(1 for d in data if d["label"] == "Fake")

    # 🚨 High fake %
    if total > 0 and (fake / total) > 0.4:
        alerts.append({"type": "Fraud", "msg": "High fake review percentage 🚨"})

    # 📈 Spike detection
    daily = {}
    for d in data:
        date = d["timestamp"].strftime("%Y-%m-%d")
        daily[date] = daily.get(date, 0) + 1

    for date, count in daily.items():
        if count > 10:
            alerts.append({"type": "Spike", "msg": f"Review spike on {date}"})

    return alerts


# ==============================
# 📄 ALL REVIEWS
# ==============================

@app.get("/reviews")
def get_reviews():
    return list(collection.find({}, {"_id": 0}))

@app.get("/trend")
def get_trend():
    reviews = list(collection.find())

    trend = defaultdict(lambda: {"fake": 0, "real": 0})

    for r in reviews:
        date = r["timestamp"].strftime("%Y-%m-%d")

        if r["label"] == "Fake":
            trend[date]["fake"] += 1
        else:
            trend[date]["real"] += 1

    result = []
    for date, values in sorted(trend.items()):
        result.append({
            "date": date,
            "fake": values["fake"],
            "real": values["real"]
        })

    return result