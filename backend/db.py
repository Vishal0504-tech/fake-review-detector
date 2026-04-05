from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise Exception("MONGO_URL is not set!")

client = MongoClient(MONGO_URL)

# 🔥 Test connection
client.admin.command("ping")
print("✅ MongoDB Connected!")

db = client["fake_review_db"]
collection = db["reviews"]