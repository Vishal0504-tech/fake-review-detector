# 🛡️ Fake Review Detector — Complete 15-Point Project Breakdown

> Every concept explained through **your actual code**, architecture, and design decisions.

---

## 1. 🎯 Problem & Purpose

### What problem does it solve?
Online platforms (Amazon, Flipkart, Google Maps) are flooded with **fabricated reviews** — bots and paid posters writing fake praise or fake criticism. This destroys consumer trust and distorts purchasing decisions.

Your app solves this by using a **machine learning model** to classify any review text as `Real` or `Fake` — instantly.

### Who are the target users?
| User | Need |
|------|------|
| E-commerce platforms | Monitor review quality at scale |
| Business owners | Detect attacks on their reputation |
| Researchers | Analyse fake review patterns |
| Individual consumers | Verify if a review is trustworthy |

### What makes it different?
- ✅ **Text-only focus** — no product dependency, works for any review domain
- ✅ **Real-time ML prediction** with confidence score (0–100 %)
- ✅ **Dashboard analytics** with time-series trend tracking
- ✅ **Alert system** that detects fraud spikes automatically
- ✅ **Full history management** with delete capability

---

## 2. 📋 Requirements Gathering

### Functional Requirements (what the app *must* do)

| # | Feature | Evidence in Your Code |
|---|---------|----------------------|
| 1 | Analyse review text → Fake / Real | `POST /analyze` in `main.py` |
| 2 | Show confidence score | `score` field → displayed as `%` in `ResultCard` |
| 3 | Save every result to database | `collection.insert_one(data)` in `/analyze` |
| 4 | View all past reviews | `GET /reviews` → History page |
| 5 | Delete a review | `DELETE /delete-review/{id}` |
| 6 | Dashboard statistics | `GET /dashboard` → Total, Fake, Real, Fake % |
| 7 | Time-series trend | `GET /time-analysis` → Line chart |
| 8 | Fraud alerts | `GET /alerts` → spike & high-fake detection |

### Non-Functional Requirements (how well it works)

| Requirement | How Your App Handles It |
|-------------|------------------------|
| **Performance** | `cache: "no-store"` fetches ensure fresh data; ML model loaded once at startup |
| **Scalability** | MongoDB handles millions of documents; FastAPI is async-capable |
| **Security** | `.env` / `.env.local` store secrets; CORS configured |
| **Usability** | Loading spinners, error states, colour-coded results |
| **Reliability** | Error boundaries on every API call with user-facing messages |

---

## 3. 🧰 Technology Stack

```
┌──────────────────────────────────────────────────────────┐
│                  FAKE REVIEW DETECTOR                    │
├──────────────────────┬───────────────────────────────────┤
│      FRONTEND        │            BACKEND                │
│  Next.js 14 (React)  │  FastAPI (Python)                 │
│  Tailwind CSS        │  Uvicorn (ASGI server)            │
│  Recharts            │  scikit-learn (ML model)          │
│  services/api.js     │  NumPy / Pandas                   │
├──────────────────────┴───────────────────────────────────┤
│                      DATABASE                            │
│           MongoDB  (PyMongo driver)                      │
│           Database: fake_review_db                       │
│           Collection: reviews                            │
└──────────────────────────────────────────────────────────┘
```

### Why these choices?

| Technology | Why It Fits This Project |
|-----------|--------------------------|
| **Next.js** | File-based routing gives `/dashboard`, `/history`, `/alerts` for free |
| **FastAPI** | Python-native — plugs directly into scikit-learn with zero overhead |
| **MongoDB** | Schema-flexible; store any review fields without migrations |
| **scikit-learn** | Industry-standard, simple `predict()` API, fast inference |
| **Recharts** | Composable React charts — powers your Pie, Bar, and Line charts |

From your actual files:
```python
# backend/requirements.txt
fastapi
uvicorn
pymongo
python-dotenv
scikit-learn
pandas
numpy
```
```js
// frontend/services/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

---

## 4. 🏗️ System Design & Architecture

Your app uses a **Monolithic REST API** architecture — the right choice at this scale.

```
┌──────────────────┐       HTTP / REST        ┌───────────────────────────┐
│                  │ ──── POST /analyze ────► │                           │
│   NEXT.JS        │ ──── GET /dashboard ───► │   FASTAPI  (main.py)      │
│   FRONTEND       │ ──── GET /reviews ─────► │                           │
│   Port 3000      │ ──── GET /time-analysis► │   ML Predictor            │
│                  │ ──── GET /alerts ──────► │   (models/predictor.py)   │
│                  │ ◄─── JSON responses ───  │                           │
└──────────────────┘                          └──────────┬────────────────┘
                                                         │  PyMongo
                                                         ▼
                                              ┌──────────────────────────┐
                                              │        MONGODB            │
                                              │   fake_review_db          │
                                              │   └── reviews collection  │
                                              └──────────────────────────┘
```

### API Design Decisions

```python
# RESTful endpoints in main.py
GET    /                    → Health check ("API is running 🚀")
POST   /analyze             → Predict + save to MongoDB
GET    /reviews             → List all stored reviews
DELETE /delete-review/{id}  → Remove one review by ObjectId
GET    /dashboard           → Aggregated counts & fake %
GET    /time-analysis       → Daily grouped data for line chart
GET    /alerts              → Rule-based fraud detection
```

> [!NOTE]
> You use **REST** (not GraphQL) — perfect here because each endpoint has a single, clear responsibility and there are no complex nested data requirements.

---

## 5. 🎨 UI/UX Design

Your UI follows **modern dark-mode glassmorphism** design principles:

```js
// dashboard/page.js — design tokens in action
"min-h-screen bg-[#070c18]"            // Deep space dark background
"bg-gradient-to-br from-cyan-500/10"   // Glassmorphism gradient cards
"border border-cyan-500/20"            // Subtle neon borders
"backdrop-blur-sm"                     // Frosted glass layer
"text-3xl font-extrabold tabular-nums" // Big, readable statistics
```

### UX Patterns Implemented

| Pattern | Where in Code | Purpose |
|---------|--------------|---------|
| **Loading spinner** | `dashboard/page.js` L51–63 | Prevents blank screen during API fetch |
| **Error boundary** | All pages, every `catch` block | User-friendly messages, not crash screens |
| **Colour semantics** | Rose = Fake, Emerald = Real, Cyan = Total | Instant visual understanding |
| **Keyboard shortcut** | `Ctrl+Enter` to analyse | Power-user efficiency |
| **Empty state** | `EmptyChart` component | Guides users when no data exists yet |
| **Confidence bar** | Progress bar in `ResultCard` | Shows ML certainty as a visual percentage |

### Responsiveness
```js
// 2 columns on mobile → 4 columns on desktop
"grid grid-cols-2 sm:grid-cols-4 gap-4"

// 1 column on mobile → 2 columns on desktop
"grid md:grid-cols-2 gap-6"
```

---

## 6. 🗄️ Database Design

### Collection: `reviews`

```json
{
  "_id":       "ObjectId('6630a9f...')",
  "text":      "This product is amazing!!",
  "label":     "Fake",
  "score":     0.8712,
  "timestamp": "2026-04-08T13:30:00Z"
}
```

| Field | Type | Purpose |
|-------|------|---------|
| `_id` | ObjectId | Unique identifier (used for deletion) |
| `text` | String | Original review content |
| `label` | String | `"Fake"` or `"Real"` — ML output |
| `score` | Float | Confidence value `0.0 → 1.0` |
| `timestamp` | DateTime | When review was analysed |

```python
# db.py — connection setup
client     = MongoClient(MONGO_URL)
db         = client["fake_review_db"]
collection = db["reviews"]
```

> [!TIP]
> **Add a performance index on `timestamp`** for faster time-series queries:
> ```python
> collection.create_index([("timestamp", -1)])
> collection.create_index([("label", 1)])
> ```

---

## 7. 🔐 Security Basics

### What you've already done correctly ✅

```python
# Secrets in .env — never hardcoded
MONGO_URL = os.getenv("MONGO_URL")
```
```js
// Secrets in .env.local — never in source code
NEXT_PUBLIC_API_URL = http://localhost:8000
```
```python
# Pydantic auto-validates every request body
class Review(BaseModel):
    text: str   # FastAPI rejects non-string or missing fields with 422
```

### ⚠️ Areas to Improve

| Issue | Current State | Fix |
|-------|--------------|-----|
| **CORS** | `allow_origins=["*"]` | Restrict to your frontend URL in production |
| **Rate limiting** | None | Add `slowapi` to prevent bot abuse |
| **Input length** | No limit | Add `max_length=2000` to `Review` model |
| **Authentication** | None needed yet | Add JWT if you add user accounts later |

```python
# 🔧 Tighter Review model
from pydantic import BaseModel, validator

class Review(BaseModel):
    text: str

    @validator('text')
    def validate_text(cls, v):
        v = v.strip()
        if len(v) < 5:
            raise ValueError('Review text too short')
        if len(v) > 2000:
            raise ValueError('Review text too long')
        return v
```

---

## 8. ⚡ Scalability & Performance

### Current Architecture Handles:
- Hundreds of concurrent users (FastAPI + Uvicorn async)
- Thousands of reviews (MongoDB efficient for this scale)
- Real-time charts (client-side Recharts, no server load)

### Best Practice Already In Your Code
```js
// ✅ Parallel API calls — both requests fire simultaneously
Promise.all([getDashboardData(), getTimeAnalysis()])
  .then(([s, t]) => { setStats(s); setTrend(t); })

// ✅ Always fresh data — bypasses browser cache
{ cache: "no-store" }
```

### Future Scaling Path
```
Stage 1 (Now):   Single FastAPI server + MongoDB Atlas Free
     ↓
Stage 2:         Add Redis cache for /dashboard (refresh every 5 min)
     ↓
Stage 3:         Async ML prediction via Celery worker queue
     ↓
Stage 4:         ML model as separate microservice
     ↓
Stage 5:         Nginx load balancer → multiple FastAPI instances
```

---

## 9. 🌿 Version Control

Your project has a `.git` folder — Git is already set up. Best practices:

### Branch Strategy

```
main              ← stable, production-ready code only
  └── develop     ← integration branch
        ├── feature/export-csv
        ├── feature/user-auth
        ├── fix/cors-production
        └── feature/bulk-analyze
```

### Commit Message Convention (recommended)
```
feat: add bulk review analysis endpoint
fix:  restrict CORS to production domain
docs: add API reference to README
test: add unit tests for /analyze endpoint
refactor: extract chart components to /components
```

### Already Protected in .gitignore
```
.env              ← MongoDB Atlas credentials
.env.local        ← Frontend API URL
node_modules/     ← npm dependencies
__pycache__/      ← Python compiled cache
.next/            ← Next.js build output
```

> [!IMPORTANT]
> Never commit `.env` files. Your MongoDB Atlas URL contains credentials that give full database access. This is critical.

---

## 10. 🧪 Testing

### What Your App Currently Has
- Manual testing via the UI
- FastAPI auto-generates Swagger UI at `http://localhost:8000/docs` — test every endpoint there

### Recommended Unit Tests

```python
# backend/tests/test_api.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_home_route():
    res = client.get("/")
    assert res.status_code == 200
    assert "running" in res.json()["message"]

def test_analyze_returns_label_and_score():
    res = client.post("/analyze", json={"text": "Best product ever!!"})
    assert res.status_code == 200
    data = res.json()
    assert data["label"] in ["Fake", "Real"]
    assert 0.0 <= data["score"] <= 1.0

def test_analyze_empty_text_rejected():
    res = client.post("/analyze", json={"text": ""})
    assert res.status_code == 422  # Pydantic validation error

def test_dashboard_returns_counts():
    res = client.get("/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert "total_reviews" in data
    assert "fake_percentage" in data
```

### Frontend Manual Test Checklist
```
✅ Enter review text → click Analyze → result appears
✅ Result shows label + colour-coded confidence bar
✅ Dashboard stats update after analysis
✅ History page shows newly added review
✅ Delete button removes review from history
✅ Alerts page shows warning when >40% are fake
✅ Charts render correctly with no data (empty state)
✅ Ctrl+Enter triggers analysis
```

---

## 11. 🚀 Deployment & DevOps

### Current Local Development Setup
```bash
# Terminal 1 — Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev     # → http://localhost:3000
```

### Production Deployment Plan

```
FRONTEND → Vercel (free)
  - Connect GitHub repo
  - Set NEXT_PUBLIC_API_URL = https://your-api.render.com
  - Auto-deploys on every push to main

BACKEND → Render (free tier)
  - Connect GitHub repo
  - Set MONGO_URL in environment variables
  - Build command: pip install -r requirements.txt
  - Start command: uvicorn main:app --host 0.0.0.0 --port $PORT

DATABASE → MongoDB Atlas (free 512MB)
  - Already cloud-hosted if you use Atlas
  - Whitelist Render IP (or 0.0.0.0/0 for simplicity)
```

### Dockerfile (add to `/backend`)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 12. 📊 Monitoring & Maintenance

### Built-in Monitoring — Already in Your App!
```python
# main.py — Your /alerts endpoint IS a monitoring system
@app.get("/alerts")
def alerts():
    # Rule 1: High fake review rate (>40%)
    if total > 0 and (fake / total) > 0.4:
        result.append({"type": "Fraud", "msg": "High fake review % 🚨"})

    # Rule 2: Traffic spike (>10 reviews in one day)
    for date, count in daily.items():
        if count > 10:
            result.append({"type": "Spike", "msg": f"Spike on {date} 📈"})
```

### Recommended Additions

| Tool | Purpose | Cost |
|------|---------|------|
| **Sentry** | Capture frontend & backend exceptions | Free tier |
| **UptimeRobot** | Ping your API every 5 min, alert if down | Free |
| **Python logging** | Log every request + prediction to file | Built-in |
| **MongoDB Atlas Metrics** | Database performance dashboard | Built-in |

```python
# Add structured logging to main.py
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/analyze")
def analyze(review: Review):
    logger.info(f"Analyzing review — length: {len(review.text)} chars")
    result = predict_review(review.text)
    logger.info(f"Prediction: {result['label']} ({result['score']:.3f})")
    ...
```

---

## 13. ⚖️ Legal & Compliance

| Area | Status | Action Required |
|------|--------|----------------|
| **Data deletion** | ✅ `DELETE /delete-review/{id}` exists | GDPR right-to-erasure satisfied |
| **Data retention** | ❌ Reviews stored forever | Add auto-delete after 90 days |
| **Privacy Policy** | ❌ Not present | Add `/privacy` page before public launch |
| **AI transparency** | ❌ No disclaimer | Add: *"Results are AI-generated estimates"* |
| **OSS licences** | ✅ FastAPI (MIT), scikit-learn (BSD), Next.js (MIT) | All permissive — no restrictions |

> [!WARNING]
> If EU users will use your app, GDPR applies. You must: (1) disclose what data you collect, (2) allow deletion on request, and (3) have a Privacy Policy. Your delete endpoint already satisfies point 2.

---

## 14. 📚 Documentation

### What Your Project Already Has
```
frontend/README.md     ← Project overview
frontend/AGENTS.md     ← Agent/AI instructions
backend/main.py        ← Inline emoji-section comments (well done!)
/docs                  ← FastAPI auto Swagger UI (free!)
```

### Your Inline Comments Are Well-Structured
```python
# ==============================
# 🤖 ANALYZE
# ==============================
@app.post("/analyze")
def analyze(review: Review):
    ...
```

### Suggested README Additions

```markdown
## 🚀 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # Add your MONGO_URL
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local   # Add your API URL
npm run dev
```

## 🔑 Environment Variables
| Variable | File | Description |
|----------|------|-------------|
| `MONGO_URL` | `backend/.env` | MongoDB connection string |
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` | FastAPI base URL |

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Classify a review text |
| GET | `/reviews` | Fetch all stored reviews |
| DELETE | `/delete-review/{id}` | Delete a review |
| GET | `/dashboard` | Summary statistics |
| GET | `/time-analysis` | Daily trend data |
| GET | `/alerts` | Fraud alert checks |
```

---

## 15. 💰 Budget & Time Planning

### Development Time Estimate

| Phase | Task | Time (est.) |
|-------|------|------------|
| Backend | FastAPI setup + MongoDB connection | 2–3 hrs |
| ML Model | Training / loading scikit-learn classifier | 3–4 hrs |
| API Routes | All 7 endpoints | 3–4 hrs |
| Frontend | Next.js project setup + Tailwind | 1–2 hrs |
| UI Pages | Home, Dashboard, History, Alerts | 8–10 hrs |
| Charts | Recharts Pie + Bar + Line integration | 2–3 hrs |
| API Integration | `services/api.js` + wiring all pages | 2–3 hrs |
| Testing & Debug | End-to-end testing, bug fixes | 3–4 hrs |
| **TOTAL** | | **~24–33 hrs** |

### Monthly Infrastructure Cost

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Vercel** (Frontend) | ✅ Free | $20/mo |
| **Render** (Backend) | ✅ Free (cold starts) | $7/mo — always-on |
| **MongoDB Atlas** | ✅ 512 MB free | $9/mo — M2 cluster |
| **Domain name** | ❌ | ~$1/mo ($12/yr) |
| **TOTAL** | **$0 / month** | ~$17–18 / month |

> [!NOTE]
> Your entire project can run **completely free** on Vercel + Render + MongoDB Atlas for a portfolio or demo. The free Render tier cold-starts in ~30 seconds after inactivity — fine for personal use.

### Scaling Cost Projection

| Traffic Level | Infrastructure | Monthly Cost |
|--------------|---------------|-------------|
| < 100 users/day | Free tier | $0 |
| 1,000 users/day | Render paid + Atlas M2 | ~$17 |
| 10,000 users/day | AWS EC2 + Atlas M10 | ~$60–80 |
| 100,000 users/day | Load balancer + 3× servers | $300+ |

---

## ✅ Overall Project Health Check

```
DONE ✅
  ├── Core ML prediction engine
  ├── Full REST API (7 endpoints)
  ├── MongoDB persistence layer
  ├── Review history with delete
  ├── Dashboard with Pie + Bar charts
  ├── Time-series line chart
  ├── Rule-based fraud alert system
  └── Dark mode glassmorphism UI

RECOMMENDED NEXT STEPS 🔧
  ├── Add input validation (min/max length)
  ├── Restrict CORS to production domain
  ├── Add rate limiting with slowapi
  ├── Write 5–10 backend unit tests
  ├── Add timestamp index to MongoDB
  ├── Write a proper README with setup guide
  └── Deploy to Vercel + Render
```
