import os
import json
import base64
import uuid
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import httpx
from PIL import Image

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
    Live Vision AI Provider for Gemma / PaliGemma multimodal architecture.
    Connects to official inference endpoints (HuggingFace Inference API / Vertex AI / Google GenAI).
    """

    def __init__(self):
        self.model_id = settings.GEMMA_MODEL_ID
        self.api_key = settings.GEMMA_API_KEY
        self.api_endpoint = settings.GEMMA_API_ENDPOINT

    def check_availability(self) -> Dict[str, Any]:
        if not self.api_key:
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
        avail = self.check_availability()
        if not avail["available"]:
            return {
                "status": "UNAVAILABLE",
                "provider": "gemma_4",
                "error": avail["message"],
                "is_ambiguous": True,
                "ambiguity_reason": "Gemma Vision model credentials unconfigured on host",
            }

        try:
            with open(image_path, "rb") as f:
                image_bytes = f.read()
                b64_image = base64.b64encode(image_bytes).decode("utf-8")

            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }
            payload = {
                "inputs": {
                    "image": b64_image,
                    "prompt": GEMMA_CLINICAL_PROMPT,
                },
                "parameters": {"max_new_tokens": 512, "temperature": 0.05},
            }

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(self.api_endpoint, headers=headers, json=payload)

            if response.status_code != 200:
                logger.error(f"Gemma model API returned error {response.status_code}: {response.text}")
                return {
                    "status": "API_ERROR",
                    "provider": "gemma_4",
                    "error": f"Model inference error HTTP {response.status_code}",
                    "is_ambiguous": True,
                    "ambiguity_reason": f"External Gemma endpoint returned status {response.status_code}",
                }

            result_data = response.json()
            # Parse text response from model into JSON
            raw_text = ""
            if isinstance(result_data, list) and len(result_data) > 0:
                raw_text = result_data[0].get("generated_text", "")
            elif isinstance(result_data, dict):
                raw_text = result_data.get("generated_text", str(result_data))

            clean_json = raw_text.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json.split("```json")[1].split("```")[0].strip()
            elif clean_json.startswith("```"):
                clean_json = clean_json.split("```")[1].split("```")[0].strip()

            parsed = json.loads(clean_json)
            parsed["status"] = "SUCCESS"
            parsed["provider"] = "gemma_4"
            return parsed

        except Exception as exc:
            logger.exception("Failed during Gemma packaging extraction")
            return {
                "status": "INFERENCE_FAILED",
                "provider": "gemma_4",
                "error": str(exc),
                "is_ambiguous": True,
                "ambiguity_reason": f"Model inference failure: {str(exc)}",
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
        """
        cid = candidate_id or f"cand-{uuid.uuid4().hex[:8]}"
        extraction = await self.provider.extract_packaging_details(image_path)

        # Fallback if model was unavailable
        if extraction.get("status") in ("UNAVAILABLE", "API_ERROR", "INFERENCE_FAILED"):
            return CandidateMedicineSchema(
                id=cid,
                brand_name="Unresolved Packaging",
                generic_name="Requires Manual Verification",
                active_ingredients=[],
                strength="Unknown",
                dosage_form="Tablet",
                manufacturer=None,
                confidence=0.0,
                verification_status="unconfirmed",
                is_ambiguous=True,
                ambiguity_reason=extraction.get("ambiguity_reason") or "AI Vision provider unavailable",
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

        return CandidateMedicineSchema(
            id=cid,
            brand_name=extraction.get("brand_name", "Unidentified Brand"),
            generic_name=extraction.get("generic_name"),
            active_ingredients=ingredients,
            strength=extraction.get("strength", "Unspecified"),
            dosage_form=extraction.get("dosage_form", "Tablet"),
            manufacturer=extraction.get("manufacturer"),
            confidence=float(extraction.get("confidence", 50.0)),
            verification_status="unconfirmed",  # Gated: Must be confirmed by human patient
            is_ambiguous=bool(extraction.get("is_ambiguous", False)),
            ambiguity_reason=extraction.get("ambiguity_reason"),
        )


gemma_service = GemmaService()
