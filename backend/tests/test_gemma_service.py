import pytest
from backend.app.services.gemma_service import (
    GemmaVisionProvider,
    TestHarnessVisionProvider,
    GemmaService,
)


def test_gemma_provider_unconfigured_availability():
    provider = GemmaVisionProvider()
    provider.api_key = ""  # Simulate missing key
    avail = provider.check_availability()
    assert avail["available"] is False
    assert avail["status"] == "CONFIGURATION_ERROR"
    assert "GEMMA_API_KEY is not configured" in avail["message"]


def test_test_harness_provider_availability():
    harness = TestHarnessVisionProvider()
    avail = harness.check_availability()
    assert avail["available"] is True
    assert avail["provider"] == "test_harness"
    assert "test-deterministic" in avail["model_id"]


@pytest.mark.asyncio
async def test_abraded_packaging_triggers_uncertainty():
    harness = TestHarnessVisionProvider()
    res = await harness.extract_packaging_details("abraded_foil_sample.jpg")
    assert res["is_ambiguous"] is True
    assert res["confidence"] < 60.0
    assert "abraded" in res["ambiguity_reason"].lower()


@pytest.mark.asyncio
async def test_gemma_service_analyzes_candidate_cleanly():
    service = GemmaService()
    service.provider = TestHarnessVisionProvider()
    candidate = await service.analyze_packaging_image("crocin_sample.jpg")

    assert candidate.brand_name == "Crocin 650"
    assert len(candidate.active_ingredients) == 1
    assert candidate.active_ingredients[0].name == "Paracetamol"
    assert candidate.active_ingredients[0].amount_mg == 650.0
    assert candidate.verification_status == "unconfirmed"  # Mandatory gate before verification!
