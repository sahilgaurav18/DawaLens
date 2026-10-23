import pytest
from backend.app.schemas.medicine import MedicineVerificationInput, ActiveIngredientSchema
from backend.app.schemas.safety_report import ReportStatusEnum, SeverityLevelEnum
from backend.app.services.rule_engine import ClinicalRuleEngine


@pytest.fixture
def test_engine():
    interactions = [
        {
            "rule_code": "DR-INT-ASP-IBU-001",
            "substance_a": "Aspirin",
            "substance_b": "Ibuprofen",
            "severity": "high",
            "clinical_mechanism": "Severe gastric mucosal damage and bleeding risk.",
            "explanation_en": "Aspirin and Ibuprofen synergistically damage gastric lining.",
            "action_guidance_en": "Do not combine Aspirin and Ibuprofen.",
            "monograph_source": "CDSCO NSAID Advisory",
            "is_active": True,
        }
    ]
    duplicates = [
        {
            "canonical_salt": "Paracetamol",
            "single_dose_ceiling_mg": 1000.0,
            "daily_ceiling_mg": 4000.0,
            "clinical_risk_mechanism": "Hepatic glutathione depletion.",
            "action_guidance_en": "Avoid dual paracetamol intake.",
            "monograph_source": "National Formulary of India 2024",
            "is_active": True,
        }
    ]
    return ClinicalRuleEngine(interaction_rules=interactions, duplicate_rules=duplicates)


def test_duplicate_ingredient_detection_and_dosage_ceiling(test_engine):
    med1 = MedicineVerificationInput(
        id="m1",
        brand_name="Crocin 650",
        active_ingredients=[ActiveIngredientSchema(name="Paracetamol", strength="650mg", amount_mg=650.0)],
        strength="650 mg",
        dosage_form="Tablet",
        is_confirmed=True,
    )
    med2 = MedicineVerificationInput(
        id="m2",
        brand_name="Combiflam",
        active_ingredients=[
            ActiveIngredientSchema(name="Ibuprofen", strength="400mg", amount_mg=400.0),
            ActiveIngredientSchema(name="Acetaminophen", strength="325mg", amount_mg=325.0),  # Synonym
        ],
        strength="400 mg + 325 mg",
        dosage_form="Tablet",
        is_confirmed=True,
    )

    status, all_findings, dup_findings, int_findings, completed, failed, sources, steps = test_engine.evaluate_safety([med1, med2])

    assert status == ReportStatusEnum.RISK_DETECTED
    assert len(dup_findings) == 1
    assert dup_findings[0].type == "duplicate_ingredient"
    assert "Paracetamol" in dup_findings[0].title
    # Check that cumulative dose was summed (650 + 325 = 975mg)
    assert "975.0mg" in dup_findings[0].explanation


def test_drug_drug_interaction_detection(test_engine):
    aspirin = MedicineVerificationInput(
        id="m_asp",
        brand_name="Ecosprin 75",
        active_ingredients=[ActiveIngredientSchema(name="Aspirin", strength="75mg", amount_mg=75.0)],
        strength="75 mg",
        dosage_form="Tablet",
        is_confirmed=True,
    )
    ibuprofen = MedicineVerificationInput(
        id="m_ibu",
        brand_name="Brufen 400",
        active_ingredients=[ActiveIngredientSchema(name="Ibuprofen IP", strength="400mg", amount_mg=400.0)],
        strength="400 mg",
        dosage_form="Tablet",
        is_confirmed=True,
    )

    status, all_findings, dup_findings, int_findings, completed, failed, sources, steps = test_engine.evaluate_safety([aspirin, ibuprofen])

    assert status == ReportStatusEnum.RISK_DETECTED
    assert len(int_findings) == 1
    assert int_findings[0].severity == SeverityLevelEnum.HIGH
    assert int_findings[0].rule_id == "DR-INT-ASP-IBU-001"
    assert "CDSCO NSAID Advisory" in sources


def test_no_known_issues_in_completed_checks(test_engine):
    med1 = MedicineVerificationInput(
        id="m1",
        brand_name="Crocin 650",
        active_ingredients=[ActiveIngredientSchema(name="Paracetamol", strength="650mg", amount_mg=650.0)],
        strength="650 mg",
        dosage_form="Tablet",
        is_confirmed=True,
    )
    med2 = MedicineVerificationInput(
        id="m2",
        brand_name="Amoxyclav 625",
        active_ingredients=[
            ActiveIngredientSchema(name="Amoxicillin", strength="500mg", amount_mg=500.0),
            ActiveIngredientSchema(name="Clavulanic Acid", strength="125mg", amount_mg=125.0),
        ],
        strength="625 mg",
        dosage_form="Tablet",
        is_confirmed=True,
    )

    status, all_findings, dup_findings, int_findings, completed, failed, sources, steps = test_engine.evaluate_safety([med1, med2])

    assert status == ReportStatusEnum.NO_KNOWN_ISSUE_FOUND_IN_COMPLETED_CHECKS
    assert len(all_findings) == 0
    # Mandatory notice check
    assert any("Renal/Hepatic" in f for f in failed)


def test_verification_incomplete_gating(test_engine):
    # Medicine with unconfirmed packaging or ambiguous salt
    unconfirmed_med = MedicineVerificationInput(
        id="m_unconfirmed",
        brand_name="Faded Foil Blister",
        active_ingredients=[ActiveIngredientSchema(name="Unverified Salt", strength="Indeterminate", amount_mg=0.0)],
        strength="Unverified",
        dosage_form="Capsule",
        is_confirmed=False,  # Human did not confirm!
    )
    valid_med = MedicineVerificationInput(
        id="m_valid",
        brand_name="Crocin 650",
        active_ingredients=[ActiveIngredientSchema(name="Paracetamol", strength="650mg", amount_mg=650.0)],
        strength="650 mg",
        dosage_form="Tablet",
        is_confirmed=True,
    )

    status, all_findings, dup_findings, int_findings, completed, failed, sources, steps = test_engine.evaluate_safety([unconfirmed_med, valid_med])

    assert status == ReportStatusEnum.VERIFICATION_INCOMPLETE
    assert any(f.type == "incomplete_data" for f in all_findings)
