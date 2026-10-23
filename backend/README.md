# DawaLens Backend — Clinical Medication Safety & Packaging AI Vision Engine

The backend for DawaLens is built using **Python 3.12**, **FastAPI**, **Pydantic v2**, **SQLAlchemy**, and **Pillow**, designed to enforce clinical rigor, human-in-the-loop verification, and deterministic pharmacovigilance rule evaluation.

---

## 1. Architectural Highlights

1. **Gemma Vision Packaging AI Interface (`backend/app/services/gemma_service.py`)**:
   - Analyzes uploaded blister strips and box packaging.
   - Extracts candidate brand names, active INN chemical salts, strengths, and dosage forms.
   - Computes OCR character confidence and flags ambiguities/abrasions.
   - Provider interface supports:
     - `gemma_4` / `huggingface`: Connects to multimodal vision models (`google/paligemma2-3b-pt-224` or Vertex AI endpoints).
     - `ollama`: Local offline multimodal LLMs.
     - `test`: Deterministic test fixtures for automated testing and offline development (clearly labeled, never pretending to be live inference).
   - Returns a structured `UNAVAILABLE` or `CONFIGURATION_ERROR` status if API credentials or network are absent, preventing hallucinated inference.

2. **Mandatory Human-in-the-Loop Verification Gate (`POST /api/v1/scans/{scan_id}/verify`)**:
   - The AI **never** bypasses verification or declares a medicine safe on its own.
   - The user must review candidate details against their physical packaging.
   - Unconfirmed items are strictly blocked from proceeding silently.

3. **Deterministic Medication Safety Engine (`backend/app/services/rule_engine.py`)**:
   - **Duplicate Salt Detection**: Sums active chemical principle masses across all medicines in $O(M \cdot K)$ time and evaluates cumulative exposure against safe ceilings (e.g. Paracetamol single intake $>1,000$mg or daily ceiling $>4,000$mg).
   - **Pairwise Contraindication Matrix**: Evaluates all $\binom{U}{2}$ unordered active substance pairs in $O(U^2)$ time with $O(1)$ hash table lookup against reviewed CDSCO and WHO interaction matrices.
   - **Verification Completeness**: Any unconfirmed item or missing physiological check automatically gates the overall status to `VERIFICATION_INCOMPLETE`. Clean status (`NO_KNOWN_ISSUE_FOUND_IN_COMPLETED_CHECKS`) cannot be issued if required checks fail.

4. **Structured Database (`backend/app/models/`)**:
   - Auto-seeded with reviewed compendia from the **National Formulary of India (NFI 2024)**, **CDSCO Standard Treatment Guidelines on NSAID Combinations**, and the **WHO Model List of Essential Medicines (23rd List)**.
   - Traceable Report IDs (`REP-YYYY-XXXX`) and rule version stamps (`CDSCO-2026.4.1`).

---

## 2. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | System health, database connection, vision AI status, active rule counts |
| `POST` | `/api/v1/scans` | Upload 1 to 5 packaging images (`multipart/form-data`) and extract candidates |
| `GET` | `/api/v1/scans/{scan_id}` | Retrieve scan session and candidate extraction state |
| `POST` | `/api/v1/scans/{scan_id}/verify` | Submit patient-verified details and normalize chemical salts |
| `POST` | `/api/v1/safety-checks` | Execute deterministic multi-medicine check on verified records |
| `GET` | `/api/v1/reports` | List historical reports with search and status filtering |
| `GET` | `/api/v1/reports/{report_id}` | Retrieve full clinical safety report with evidence citations |
| `DELETE` | `/api/v1/reports/{report_id}` | Delete a saved report |
| `GET` | `/api/v1/medicines/search` | Search medicine reference database by brand or active ingredient |
| `GET` | `/api/v1/reference/sources` | List statutory clinical evidence sources and review statuses |
| `GET` | `/api/v1/reference/rules` | List active approved interaction rules and versions |

---

## 3. Setup and Run Commands (Windows PowerShell)

### Step 1: Install Python Dependencies
```powershell
pip install -r backend/requirements.txt
```

### Step 2: Configure Environment
Copy `.env.example` to `.env` in the project root:
```powershell
Copy-Item .env.example .env
```

### Step 3: Run Test Suite
```powershell
python -m pytest backend/tests/
```

### Step 4: Start the FastAPI Backend Server
```powershell
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive OpenAPI documentation will be accessible at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 4. Configuring Real Gemma Vision Inference

To enable live multimodal packaging extraction:
1. Obtain an API key from [HuggingFace](https://huggingface.co/settings/tokens) or Google Cloud Vertex AI.
2. In `.env`:
   ```env
   AI_PROVIDER=gemma_4
   GEMMA_MODEL_ID=google/paligemma2-3b-pt-224
   GEMMA_API_KEY=your_actual_token_here
   GEMMA_API_ENDPOINT=https://api-inference.huggingface.co/models/google/paligemma2-3b-pt-224
   ```
3. If no key is provided, the service returns a safe `CONFIGURATION_ERROR` status rather than generating fake model results.

---

## 5. License

Licensed under the [MIT License](../LICENSE) - Copyright (c) 2026 DawaLens Contributors.

