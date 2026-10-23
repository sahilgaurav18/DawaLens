# DawaLens (दवाLens) — AI Medicine Safety & Packaging Verification

> **Clinical-grade medicine packaging recognition, duplicate active ingredient detection, and drug-drug interaction checker powered by multimodal Vision AI and deterministic pharmacovigilance rules.**

---

## 🌟 Overview

**DawaLens** addresses one of the leading causes of preventable health complications: accidental medication duplication, unsafe multi-drug combinations, and dosage ambiguity. By combining state-of-the-art vision models (**Gemma / PaliGemma**) with **deterministic clinical rule evaluation** (referencing the National Formulary of India [NFI 2024], CDSCO guidelines, and WHO Model List of Essential Medicines), DawaLens provides patients and caregivers with actionable, verified medication safety insights.

### Core Safeguards & Principles:
- 🔍 **Vision Packaging OCR & Extraction**: Analyzes blister strips, cartons, and syrup bottles to extract candidate brand names, active INN salts, strengths, and dosage forms.
- 🛡️ **Mandatory Human-in-the-Loop Verification**: AI extractions are never trusted blindly; users must review candidate parameters against physical packaging before running clinical safety evaluations.
- ⚡ **Deterministic Safety Engine**: Evaluates cumulative single/daily active salt dosages (e.g. Paracetamol ceilings) and pairwise drug-drug contraindications.
- 🌐 **Bilingual Interface**: Built-in instant toggle between English and Hindi (हिंदी) across landing and clinical dashboards.

---

## 🏗️ Architecture & Tech Stack

```
DawaLens/
├── app/                  # Next.js 14 App Router (Landing page & Clinical Dashboard)
│   ├── dashboard/        # Multi-page dashboard (Scan, Medicines, Reports, Settings, Help)
│   └── page.tsx          # Landing page with interactive demo scanner
├── backend/              # FastAPI Python backend
│   ├── app/
│   │   ├── api/routes/   # Scans, Verification, Safety Checks, Reports, Health
│   │   ├── core/         # Settings, Pydantic v2 schemas, CORS
│   │   ├── db/           # SQLite / PostgreSQL models & NFI/CDSCO seed data
│   │   ├── models/       # SQLAlchemy ORM models
│   │   └── services/     # Gemma Vision service, Image processor, Clinical rule engine
│   └── tests/            # Pytest test suite for vision & safety rules
├── components/           # Reusable UI components (Tailwind CSS, Radix UI, Lucide icons)
├── hooks/                # React custom hooks
└── lib/                  # Client-side API connectors, state stores, language context
```

### Frontend:
- **Framework**: Next.js 14 (React 18, TypeScript)
- **Styling**: Tailwind CSS, PostCSS, Radix UI primitives, Lucide React
- **Internationalization**: Dynamic English & Hindi context

### Backend:
- **Framework**: FastAPI (Python 3.12, Uvicorn)
- **Validation**: Pydantic v2
- **Database**: SQLite (Development) / PostgreSQL (Production) via SQLAlchemy
- **Image Processing**: Pillow (PIL)
- **Multimodal AI**: Gemma / PaliGemma 2 (`google/paligemma2-3b-pt-224` via HuggingFace Inference API or Google Cloud Vertex AI)

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+ or v20+) and **pnpm** (or **npm**)
- **Python** (v3.10+)

---

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/sahilgaurav18/DawaLens.git
cd DawaLens

# Create and activate Python virtual environment
python -m venv backend/venv
# Windows PowerShell:
backend\venv\Scripts\Activate.ps1
# macOS/Linux:
source backend/venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Create .env from template
cp .env.example .env
```

Start the FastAPI development server:
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API documentation:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

### 2. Frontend Setup

In a separate terminal:
```bash
# In the project root
npm install   # or: pnpm install

# Start the Next.js dev server
npm run dev   # or: pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Backend Tests

```bash
python -m pytest backend/tests/ -v
```

---

## 🔐 Environment Variables

Key configuration options in `.env`:

| Key | Description | Default / Example |
| :--- | :--- | :--- |
| `APP_ENV` | Environment mode (`development` / `production`) | `development` |
| `DATABASE_URL` | SQLAlchemy connection string | `sqlite:///./dawalens.db` |
| `AI_PROVIDER` | Packaging vision inference provider (`gemma_4`, `huggingface`, `ollama`, `test`) | `gemma_4` |
| `GEMMA_MODEL_ID` | Multimodal model ID | `google/paligemma2-3b-pt-224` |
| `GEMMA_API_KEY` | API Key for HuggingFace or Vertex AI | *(Leave blank for test mode)* |
| `MAX_UPLOAD_SIZE_MB` | Maximum allowed image upload size | `15` |

---

## 📄 Clinical Disclaimer

> **DawaLens is an informational safety assistance tool and does not provide medical diagnosis or replace consultation with a licensed healthcare professional or pharmacist.** Always follow prescribing instructions and verified medical guidance.

---

## 📜 License

Licensed under the [MIT License](LICENSE).
