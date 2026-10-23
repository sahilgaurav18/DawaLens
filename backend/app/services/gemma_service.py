import os
import io
import json
import base64
import uuid
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import httpx
from PIL import Image
from fastapi import HTTPException

from backend.app.core.config import settings
from backend.app.schemas.medicine import CandidateMedicineSchema, ActiveIngredientSchema

logger = logging.getLogger("dawalens.gemma_service")

# Clinical Extraction Prompt for Multimodal Packaging Analysis
GEMMA_CLINICAL_PROMPT = """
You are Gemma Vision, a specialized pharmacological packaging optical character recognition (OCR) model.
Analyze the provided medicine packaging image (blister strip, box, bottle, or foil).
Extract strictly visible pharmaceutical data into a valid JSON object matching this exact schema:
{
  "brand_name": "string (brand or trade name as printed on label)",
  "generic_name": "string or null (pharmacopoeial formulation or official title)",
  "active_ingredients": [
    {
      "name": "string (chemical active salt entity e.g. Paracetamol, Ibuprofen)",
      "strength": "string (e.g. 650mg, 400mg)",
      "amount_mg": float or null
    }
  ],
  "strength": "string (e.g. 650 mg, 400 mg + 325 mg)",
  "dosage_form": "string (Tablet, Capsule, Syrup, Oral Suspension, Injection, Ointment, etc.)",
  "manufacturer": "string or null",
  "confidence": float (0.0 to 100.0 estimate of character legibility),
  "is_ambiguous": boolean (true if label is faded, folded, torn, or active salt cannot be verified with certainty),
  "ambiguity_reason": "string or null",
  "raw_visible_text": "string (key readable fragments)"
}
Rules:
1. Do NOT guess or hallucinate active ingredients. If text is illegible, set is_ambiguous to true.
2. Return ONLY the raw JSON object. Do not include markdown formatting or conversational commentary.
"""


class BaseVisionProvider(ABC):
    @abstractmethod
    async def extract_packaging_details(self, image_path: str) -> Dict[str, Any]:
        """Extracts pharmaceutical details from packaging image."""
        pass

    @abstractmethod
    def check_availability(self) -> Dict[str, Any]:
        """Checks if inference provider is configured and reachable."""
        pass


class GemmaVisionProvider(BaseVisionProvider):
    """
    Live Vision AI Provider for Gemma / PaliGemma / Gemini multimodal architecture.
    Connects to official inference endpoints with resilient model cascades and logging.
    """

    def __init__(self):
        self.model_id = settings.GEMMA_MODEL_ID or "gemini-3.5-flash-lite"
        self.api_key = settings.effective_api_key
        self.api_endpoint = settings.GEMMA_API_ENDPOINT

    def check_availability(self) -> Dict[str, Any]:
        api_key = self.api_key if hasattr(self, "api_key") and self.api_key is not None else settings.effective_api_key
        if not api_key:
            return {
                "available": False,
                "provider": "gemma_4",
                "model_id": self.model_id,
                "status": "CONFIGURATION_ERROR",
                "message": (
                    "GEMMA_API_KEY is not configured in .env. Live model inference is paused. "
                    "Set a valid API key or switch AI_PROVIDER=test for local test fixtures."
                ),
            }
        return {
            "available": True,
            "provider": "gemma_4",
            "model_id": self.model_id,
            "status": "CONFIGURED",
            "endpoint": self.api_endpoint,
        }

    async def extract_packaging_details(self, image_path: str) -> Dict[str, Any]:
        api_key = settings.effective_api_key
        avail = self.check_availability()
        if not avail["available"] or not api_key:
            return {
                "status": "UNAVAILABLE",
                "provider": "gemma_4",
                "error": avail["message"],
                "is_ambiguous": True,
                "ambiguity_reason": "Gemma Vision model credentials unconfigured on host",
            }

        # 1. Resize and prepare raw base64 and MIME type
        try:
            with Image.open(image_path) as img:
                max_dim = 1600
                w, h = img.size
                if w > max_dim or h > max_dim:
                    ratio = min(max_dim / w, max_dim / h)
                    new_size = (max(1, int(w * ratio)), max(1, int(h * ratio)))
                    img = img.resize(new_size, Image.Resampling.LANCZOS)

                buffer = io.BytesIO()
                if img.mode in ("RGBA", "P"):
                    img.save(buffer, format="PNG")
                    mime_type = "image/png"
                else:
                    img.convert("RGB").save(buffer, format="JPEG", quality=90)
                    mime_type = "image/jpeg"

                raw_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
        except Exception as exc:
            logger.error(f"Image preprocessing failed for {image_path}: {exc}")
            return {
                "status": "IMAGE_ERROR",
                "provider": "gemma_4",
                "error": f"Failed to read/process image: {exc}",
            }

        # 2. Build model candidates (primary model from settings, with fallback cascade)
        models_to_try: List[str] = []
        for m in [self.model_id, "gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-2.5-flash-lite"]:
            clean_m = m.replace("models/", "")
            if clean_m and clean_m not in models_to_try:
                models_to_try.append(clean_m)

        last_error = ""
        for current_model in models_to_try:
            google_url = f"https://generativelanguage.googleapis.com/v1beta/models/{current_model}:generateContent?key={api_key}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": GEMMA_CLINICAL_PROMPT},
                            {
                                "inline_data": {
                                    "mime_type": mime_type,
                                    "data": raw_b64,
                                }
                            },
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.1,
                    "maxOutputTokens": 1024,
                    "responseMimeType": "application/json",
                },
            }

            logger.info(f"Calling vision model '{current_model}' (MIME: {mime_type})")

            try:
                async with httpx.AsyncClient(timeout=35.0) as client:
                    response = await client.post(google_url, json=payload)

                # Server-side logging: HTTP status and model name (no image data, no keys)
                logger.info(f"Gemini API response: status={response.status_code}, model='{current_model}'")

                if response.status_code != 200:
                    err_body = response.text.replace(api_key, "[REDACTED_KEY]")[:300]
                    logger.error(f"Gemini API error (model='{current_model}', status={response.status_code}): {err_body}")
                    last_error = f"HTTP {response.status_code}: {err_body}"
                    continue

                resp_json = response.json()
                candidates = resp_json.get("candidates", [])
                if not candidates:
                    logger.error(f"Gemini returned 200 but candidate list is empty (model='{current_model}')")
                    last_error = "Empty candidate list in response"
                    continue

                parts = candidates[0].get("content", {}).get("parts", [])
                raw_text = parts[0].get("text", "") if parts else ""

                # Server-side logging: Raw text returned by model (no keys, no image data)
                logger.info(f"Gemini raw output text from '{current_model}':\n{raw_text}")

                # Robust JSON parser tolerant of code fences and commentary
                clean_json = raw_text.strip()
                if "```json" in clean_json:
                    clean_json = clean_json.split("```json")[1].split("```")[0].strip()
                elif "```" in clean_json:
                    clean_json = clean_json.split("```")[1].split("```")[0].strip()
                else:
                    first_brace = clean_json.find("{")
                    last_brace = clean_json.rfind("}")
                    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
                        clean_json = clean_json[first_brace : last_brace + 1]

                try:
                    parsed = json.loads(clean_json)
                except Exception as parse_exc:
                    logger.error(
                        f"JSON parsing failed for model='{current_model}': {parse_exc}. Raw snippet: {clean_json[:200]}"
                    )
                    last_error = f"JSON parse error: {parse_exc}"
                    continue

                # Validate whether readable pharmaceutical packaging was detected
                brand = (parsed.get("brand_name") or "").strip()
                active_ingredients = parsed.get("active_ingredients", [])
                is_ambiguous = bool(parsed.get("is_ambiguous", False))
                confidence = float(parsed.get("confidence", 0.0))

                # If no ingredients extracted and flagged ambiguous or brand is non-medicine/unknown
                if (
                    len(active_ingredients) == 0
                    and (
                        confidence <= 0.0
                        or is_ambiguous
                        or brand.lower() in ("dawalens", "unknown", "unresolved packaging", "unidentified brand", "")
                    )
                ):
                    logger.warning(
                        f"Packaging label unreadable (model='{current_model}'): brand='{brand}', "
                        f"confidence={confidence}, reason={parsed.get('ambiguity_reason')}"
                    )
                    return {
                        "status": "UNREADABLE_LABEL",
                        "provider": "gemma_4",
                        "model_used": current_model,
                        "ambiguity_reason": parsed.get("ambiguity_reason") or "Label text could not be deciphered",
                        "error": "We couldn't read this label. Try a clearer photo or try again.",
                    }

                parsed["status"] = "SUCCESS"
                parsed["provider"] = "gemma_4"
                parsed["model_used"] = current_model
                return parsed

            except httpx.TimeoutException:
                logger.error(f"Timeout while calling Gemini API (model='{current_model}')")
                last_error = f"Request timed out on {current_model}"
            except Exception as exc:
                logger.error(f"Unexpected error calling Gemini API (model='{current_model}'): {exc}")
                last_error = str(exc)

        # All models in cascade failed
        logger.error(f"All vision model candidates failed. Last error: {last_error}")
        return {
            "status": "API_ERROR",
            "provider": "gemma_4",
            "error": last_error or "Vision AI provider error",
        }


class TestHarnessVisionProvider(BaseVisionProvider):
    """
    Deterministic test harness provider for unit tests, offline development,
    and verified verification gate validation.
    Explicitly labeled to never misrepresent simulated fixtures as real model outputs.
    """

    def check_availability(self) -> Dict[str, Any]:
        return {
            "available": True,
            "provider": "test_harness",
            "model_id": "test-deterministic-fixture-harness",
            "status": "TEST_HARNESS_ACTIVE",
            "message": "Deterministic local test harness active for unit verification.",
        }

    async def extract_packaging_details(self, image_path: str) -> Dict[str, Any]:
        filename = os.path.basename(image_path).lower()

        # Deterministic fixtures matching realistic Indian blister strips
        if "combiflam" in filename:
            return {
                "status": "SUCCESS",
                "provider": "test_harness (deterministic fixture)",
                "brand_name": "Combiflam",
                "generic_name": "Ibuprofen and Paracetamol Tablets IP",
                "active_ingredients": [
                    {"name": "Ibuprofen", "strength": "400mg", "amount_mg": 400.0},
                    {"name": "Paracetamol", "strength": "325mg", "amount_mg": 325.0},
                ],
                "strength": "400 mg + 325 mg",
                "dosage_form": "Tablet",
                "manufacturer": "Sanofi India Limited",
                "confidence": 98.4,
                "is_ambiguous": False,
                "ambiguity_reason": None,
                "raw_visible_text": "Combiflam / Each film-coated tablet contains Ibuprofen IP 400mg, Paracetamol IP 325mg",
            }
        elif "amoxyclav" in filename:
            return {
                "status": "SUCCESS",
                "provider": "test_harness (deterministic fixture)",
                "brand_name": "Amoxyclav 625",
                "generic_name": "Amoxicillin and Potassium Clavulanate Tablets IP",
                "active_ingredients": [
                    {"name": "Amoxicillin", "strength": "500mg", "amount_mg": 500.0},
                    {"name": "Clavulanic Acid", "strength": "125mg", "amount_mg": 125.0},
                ],
                "strength": "500 mg + 125 mg",
                "dosage_form": "Tablet",
                "manufacturer": "Abbott Healthcare",
                "confidence": 97.6,
                "is_ambiguous": False,
                "ambiguity_reason": None,
                "raw_visible_text": "Amoxyclav 625 / Amoxicillin 500mg, Clavulanic Acid 125mg",
            }
        elif "aspirin" in filename or "ecosprin" in filename:
            return {
                "status": "SUCCESS",
                "provider": "test_harness (deterministic fixture)",
                "brand_name": "Ecosprin 75",
                "generic_name": "Aspirin Gastro-Resistant Tablets IP",
                "active_ingredients": [
                    {"name": "Aspirin", "strength": "75mg", "amount_mg": 75.0},
                ],
                "strength": "75 mg",
                "dosage_form": "Tablet",
                "manufacturer": "USV Private Limited",
                "confidence": 96.8,
                "is_ambiguous": False,
                "ambiguity_reason": None,
                "raw_visible_text": "Ecosprin 75 / Aspirin IP 75mg",
            }
        elif "abraded" in filename or "faded" in filename:
            return {
                "status": "SUCCESS",
                "provider": "test_harness (deterministic fixture)",
                "brand_name": "Generic Analgesic",
                "generic_name": "Indeterminate Formulation",
                "active_ingredients": [
                    {"name": "Unverified Salt", "strength": "Indeterminate", "amount_mg": 0.0},
                ],
                "strength": "Unverified",
                "dosage_form": "Capsule",
                "manufacturer": "Unresolved",
                "confidence": 52.0,
                "is_ambiguous": True,
                "ambiguity_reason": "Label text abraded near blister seam. Salt strength cannot be confirmed optically.",
                "raw_visible_text": "Foil strip worn / Characters partially missing",
            }
        else:
            # Default antipyretic blister strip
            return {
                "status": "SUCCESS",
                "provider": "test_harness (deterministic fixture)",
                "brand_name": "Crocin 650",
                "generic_name": "Paracetamol Tablets IP",
                "active_ingredients": [
                    {"name": "Paracetamol", "strength": "650mg", "amount_mg": 650.0},
                ],
                "strength": "650 mg",
                "dosage_form": "Tablet",
                "manufacturer": "GlaxoSmithKline Pharmaceuticals",
                "confidence": 99.2,
                "is_ambiguous": False,
                "ambiguity_reason": None,
                "raw_visible_text": "Crocin 650 Fast Release / Each tablet contains Paracetamol IP 650mg",
            }


class GemmaService:
    """
    Central AI service module for medicine packaging optical identification.
    Encapsulates vision model providers behind a clean clinical interface.
    """

    def __init__(self):
        provider_type = settings.AI_PROVIDER.lower().strip()
        if provider_type in ("test", "mock"):
            self.provider: BaseVisionProvider = TestHarnessVisionProvider()
        else:
            # Default to GemmaVisionProvider with availability checking
            self.provider = GemmaVisionProvider()

    def get_service_status(self) -> Dict[str, Any]:
        return self.provider.check_availability()

    async def analyze_packaging_image(self, image_path: str, candidate_id: Optional[str] = None) -> CandidateMedicineSchema:
        """
        Executes vision model analysis and transforms the result into a validated CandidateMedicineSchema.
        Human verification is strictly enforced before any data enters the safety engine.
        If the call fails or label cannot be read, raises HTTPException(422) instead of a silent fallback.
        """
        cid = candidate_id or f"cand-{uuid.uuid4().hex[:8]}"
        extraction = await self.provider.extract_packaging_details(image_path)

        # Remove silent fallback: If extraction failed or unreadable, return a clear 422 error
        if extraction.get("status") != "SUCCESS":
            detail = extraction.get("error") or "We couldn't read this label. Try a clearer photo or try again."
            logger.warning(f"Scan analysis rejected (status={extraction.get('status')}): {detail}")
            raise HTTPException(
                status_code=422,
                detail="We couldn't read this label. Try a clearer photo or try again.",
            )

        ingredients = []
        for ing in extraction.get("active_ingredients", []):
            ingredients.append(
                ActiveIngredientSchema(
                    name=ing.get("name", "Unknown Substance"),
                    strength=ing.get("strength", "Unknown"),
                    amount_mg=ing.get("amount_mg"),
                )
            )

        brand_name = (extraction.get("brand_name") or "").strip()
        confidence = float(extraction.get("confidence", 0.0))
        is_ambiguous = bool(extraction.get("is_ambiguous", False))

        # Disallow empty/fake "Unresolved Packaging" cards from passing as results
        if not brand_name or brand_name.lower() in ("unresolved packaging", "unidentified brand", "unknown"):
            if len(ingredients) == 0:
                logger.warning(f"Rejecting unreadable packaging label: brand='{brand_name}', confidence={confidence}")
                raise HTTPException(
                    status_code=422,
                    detail="We couldn't read this label. Try a clearer photo or try again.",
                )

        return CandidateMedicineSchema(
            id=cid,
            brand_name=brand_name or "Unidentified Brand",
            generic_name=extraction.get("generic_name"),
            active_ingredients=ingredients,
            strength=extraction.get("strength", "Unspecified"),
            dosage_form=extraction.get("dosage_form", "Tablet"),
            manufacturer=extraction.get("manufacturer"),
            confidence=confidence,
            verification_status="unconfirmed",  # Gated: Must be confirmed by human patient
            is_ambiguous=is_ambiguous,
            ambiguity_reason=extraction.get("ambiguity_reason"),
        )


gemma_service = GemmaService()
