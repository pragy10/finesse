# finesse

**AI-powered insurance policy assistant.** Upload your policy PDF, ask questions in plain English, and get answers with exact clause citations.

---

## What It Does

- Upload insurance policy documents (PDF)
- Ask questions like *"Am I covered for water damage?"*
- Get answers backed by direct quotes from your policy
- Smart AI reasons through your policy using semantic search

---

## Tech Stack

| Area | Tools |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express |
| Auth | Firebase (email/password + Google) |
| Database | Firestore (doc metadata) |
| Storage | Supabase (PDF files) |
| Vector DB | Qdrant Cloud |
| Embeddings | HuggingFace (`all-MiniLM-L6-v2`) |
| AI / LLM | OpenRouter (DeepSeek, Gemini, etc.) |
| Monitoring | Prometheus & Grafana (via `prom-client`) |

---

## Prerequisites

- **Node.js** v18+
- **Firebase** project with Auth (email + Google) and Firestore enabled
- **Supabase** project with a public storage bucket named `documents`
- **Qdrant Cloud** account with a collection named `policy_documents` (384 dimensions, cosine distance)
- **HuggingFace** account (free token)
- **OpenRouter** API key (get one at [openrouter.ai](https://openrouter.ai))

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/pragy10/finesse.git
cd finesse
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
# Qdrant
QDRANT_URL=https://your-cluster.cloud.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key

# HuggingFace
HF_TOKEN=your_huggingface_token

# OpenRouter (LLM)
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=deepseek/deepseek-chat

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET=documents

# Firebase Service Account
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json

NODE_ENV=development
```

> **Firebase Service Account:** Go to Firebase Console → Project Settings → Service Accounts → Generate new private key. Save the JSON file as `backend/config/firebase-service-account.json`.

Start the backend:

```bash
npm run dev
```

Runs on `http://localhost:3001`

### 3. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

Runs on `http://localhost:5173`

---

## Qdrant Collection Setup

If you have not created the Qdrant collection yet, run:

```bash
cd backend
node setup/createCollection.js
```

This creates a `policy_documents` collection with 384 dimensions and cosine distance.

---

## Project Structure

```
finesse/
├── backend/
│   ├── config/         # Firebase, Supabase, OpenRouter & metrics
│   ├── llm/            # AI reasoning engine & prompt templates
│   ├── vector/         # Qdrant vector search
│   ├── parsing/        # PDF text extraction
│   ├── routes/         # API endpoints (/ask, /documents, etc.)
│   ├── middleware/     # Firebase auth middleware
│   └── setup/          # One-time setup scripts
├── frontend/
│   └── src/
│       ├── components/ # UI components
│       ├── pages/      # Route pages
│       ├── context/    # Auth & document state
│       └── styles/     # Global CSS
└── monitoring/         # Prometheus scrape config & Grafana dashboard
```

---

## 📊 Monitoring (Prometheus & Grafana)

The backend exposes real-time Prometheus metrics at `http://localhost:3001/metrics` tracking HTTP traffic, AI query latency, and document activity.

To view live dashboards locally (no Docker required):

1. **Prometheus:** Run the binary with our pre-configured YAML:
   ```bash
   prometheus --config.file=monitoring/prometheus.yml
   ```
   Scrapes metrics from `http://localhost:3001/metrics` (UI: `http://localhost:9090`).

2. **Grafana:** Run the Grafana server:
   ```bash
   grafana server
   ```
   Open `http://localhost:3000` (default login: `admin` / `admin`), add Prometheus as data source, and import `monitoring/grafana-dashboard.json`.

> See [`monitoring/README.md`](monitoring/README.md) for the complete step-by-step setup guide.

---

## Notes

- The Firebase service account JSON is **not committed to git** — add it manually.
- Swap LLM models anytime via `OPENROUTER_MODEL` in `.env`. Any model on [openrouter.ai/models](https://openrouter.ai/models) works.
- Supabase is used **only for file storage** — all metadata lives in Firestore.

---

Built by [Pragy](https://github.com/pragy10)
