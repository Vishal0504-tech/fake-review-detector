from pymongo import MongoClient
import os

MONGO_URL = os.getenv("MONGO_URL")

# ❌ Safety check
if not MONGO_URL:
    raise Exception("MONGO_URL is not set!")

client = MongoClient(MONGO_URL)

# 🔥 Force connection check
client.admin.command("ping")

db = client["fake_review_db"]
collection = db["reviews"]