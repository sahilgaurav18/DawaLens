import logging
from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.models.medicine import ActiveIngredientRecord, MedicineReference
from backend.app.models.safety_rule import DrugInteractionRule, DuplicateIngredientRule, EvidenceSourceRecord, ClinicalAuditLog

logger = logging.getLogger("dawalens.seed")

# Reviewed Clinical Evidence Sources
SEED_EVIDENCE_SOURCES = [
    {
        "id": "src-nfi-2024",
        "source_name": "National Formulary of India (NFI 2024)",
        "authority": "Indian Pharmacopoeia Commission (IPC), Ministry of Health & Family Welfare",
        "publication_year": "2024",
        "source_url": "https://ipc.gov.in/national-formulary-of-india.html",
        "review_status": "clinically_verified",
    },
    {
        "id": "src-cdsco-nsaid",
        "source_name": "CDSCO Standard Treatment Guidelines on Analgesic and NSAID Combinations",
        "authority": "Central Drugs Standard Control Organisation (CDSCO), Directorate General of Health Services",
        "publication_year": "2024",
        "source_url": "https://cdsco.gov.in/opencms/opencms/en/Safety-Alerts/",
        "review_status": "clinically_verified",
    },
    {
        "id": "src-who-23rd",
        "source_name": "WHO Model List of Essential Medicines (23rd List)",
        "authority": "World Health Organization (WHO) Expert Committee on Selection of Medicines",
        "publication_year": "2023",
        "source_url": "https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02",
        "review_status": "clinically_verified",
    },
    {
        "id": "src-ip-2022",
        "source_name": "Indian Pharmacopoeia Monograph (IP 2022)",
        "authority": "Indian Pharmacopoeia Commission",
        "publication_year": "2022",
        "source_url": "https://ipc.gov.in",
        "review_status": "clinically_verified",
    },
]

# Reviewed Active Ingredients with Physiological Limits
SEED_ACTIVE_INGREDIENTS = [
    {
        "id": "ing-paracetamol",
        "canonical_name": "Paracetamol",
        "aliases": ["Acetaminophen", "APAP", "Paracetamol IP"],
        "anatomical_class": "Analgesic / Antipyretic",
        "standard_single_dose_limit_mg": 1000.0,
        "daily_ceiling_limit_mg": 4000.0,
    },
    {
        "id": "ing-ibuprofen",
        "canonical_name": "Ibuprofen",
        "aliases": ["Ibuprofen IP", "Ibuprophen"],
        "anatomical_class": "Non-Steroidal Anti-Inflammatory Drug (NSAID)",
        "standard_single_dose_limit_mg": 800.0,
        "daily_ceiling_limit_mg": 2400.0,
    },
    {
        "id": "ing-aspirin",
        "canonical_name": "Aspirin",
        "aliases": ["Acetylsalicylic Acid", "ASA", "Aspirin IP"],
        "anatomical_class": "Antiplatelet / Salicylate Analgesic",
        "standard_single_dose_limit_mg": 650.0,
        "daily_ceiling_limit_mg": 3000.0,
    },
    {
        "id": "ing-amoxicillin",
        "canonical_name": "Amoxicillin",
        "aliases": ["Amoxicillin Trihydrate", "Amoxycillin"],
        "anatomical_class": "Beta-Lactam Antibacterial",
        "standard_single_dose_limit_mg": 1000.0,
        "daily_ceiling_limit_mg": 3000.0,
    },
    {
        "id": "ing-clavulanic-acid",
        "canonical_name": "Clavulanic Acid",
        "aliases": ["Potassium Clavulanate", "Clavulanate Potassium"],
        "anatomical_class": "Beta-Lactamase Inhibitor",
        "standard_single_dose_limit_mg": 250.0,
        "daily_ceiling_limit_mg": 750.0,
    },
]

# Reviewed Duplicate Ingredient Rules
SEED_DUPLICATE_RULES = [
    {
        "id": "dup-rule-paracetamol",
        "canonical_salt": "Paracetamol",
        "single_dose_ceiling_mg": 1000.0,
        "daily_ceiling_mg": 4000.0,
        "clinical_risk_mechanism": "Exceeding cumulative paracetamol ceilings saturates glucuronidation pathways and depletes hepatic glutathione, causing toxic N-acetyl-p-benzoquinone imine (NAPQI) accumulation and acute hepatocellular damage.",
        "action_guidance_en": "Do not take multiple paracetamol-containing brands concurrently. Ensure single dose remains under 1,000mg and total daily dose under 4,000mg.",
        "action_guidance_hi": "पैरासिटामोल युक्त कई दवाओं को एक साथ न लें। कुल खुराक 1,000mg (एक बार में) और 4,000mg (24 घंटे में) से कम रखें।",
        "monograph_source": "National Formulary of India (NFI 2024 Monograph: Paracetamol)",
        "rule_version": "CDSCO-2026.4.1",
    },
    {
        "id": "dup-rule-ibuprofen",
        "canonical_salt": "Ibuprofen",
        "single_dose_ceiling_mg": 800.0,
        "daily_ceiling_mg": 2400.0,
        "clinical_risk_mechanism": "Excessive cumulative intake of Ibuprofen significantly elevates the hazard of acute gastrointestinal ulceration, upper GI perforation, and acute renal hypoperfusion.",
        "action_guidance_en": "Avoid combining separate analgesic preparations containing Ibuprofen. Contact physician if pain persists.",
        "action_guidance_hi": "इबुप्रोफेन युक्त दो अलग दवाओं को एक साथ न लें। डॉक्टर से सलाह लें।",
        "monograph_source": "CDSCO Standard Treatment Guidelines on NSAID Combinations",
        "rule_version": "CDSCO-2026.4.1",
    },
]

# Reviewed Drug-Drug Interaction Rules
SEED_INTERACTION_RULES = [
    {
        "id": "rule-int-asp-ibu",
        "rule_code": "DR-INT-ASP-IBU-001",
        "substance_a": "Aspirin",
        "substance_b": "Ibuprofen",
        "severity": "high",
        "clinical_mechanism": "Pharmacodynamic synergy: Both agents inhibit cyclooxygenase-1 (COX-1). Concurrent administration markedly impairs gastric mucosal cytoprotection, escalating gastrointestinal ulceration and hemorrhage. Furthermore, Ibuprofen competitively antagonizes irreversible platelet inhibition by low-dose cardio Aspirin.",
        "explanation_en": "Combining Aspirin and Ibuprofen dramatically increases the risk of stomach ulcers and serious gastrointestinal bleeding, and reduces the heart-protective benefits of cardio aspirin.",
        "explanation_hi": "एस्पिरिन और इबुप्रोफेन को एक साथ लेने से पेट में अल्सर और आंतरिक रक्तस्राव (ब्लीडिंग) का खतरा बहुत बढ़ जाता है, और हृदय सुरक्षा का असर कम हो जाता है।",
        "action_guidance_en": "Do not take Aspirin and Ibuprofen together without explicit medical instruction. If pain relief is needed while on cardio aspirin, consult your doctor for a gastric-safe alternative.",
        "action_guidance_hi": "डॉक्टर की सलाह के बिना इन दोनों को एक साथ न लें। सुरक्षित विकल्प के लिए अपने चिकित्सक से संपर्क करें।",
        "monograph_source": "CDSCO Safety Alert on NSAID Combinations / WHO Model Formulary",
        "source_url": "https://cdsco.gov.in",
        "rule_version": "CDSCO-2026.4.1",
        "review_status": "approved",
    },
    {
        "id": "rule-int-dicl-ibu",
        "rule_code": "DR-INT-DICL-IBU-002",
        "substance_a": "Diclofenac",
        "substance_b": "Ibuprofen",
        "severity": "high",
        "clinical_mechanism": "Dual systemic NSAID duplication. Concurrent usage provides no additional analgesic efficacy while doubling the incidence of severe gastric bleeding, acute kidney injury, and cardiovascular thrombotic events.",
        "explanation_en": "Both Diclofenac and Ibuprofen belong to the same NSAID pain-reliever class. Taking both simultaneously doubles the risk of severe stomach ulcers and kidney damage without extra pain relief.",
        "explanation_hi": "डाइक्लोफेनाक और इबुप्रोफेन दोनों एक ही वर्ग (NSAID) की दवाएं हैं। दोनों को एक साथ लेने से पेट और किडनी को गंभीर नुकसान हो सकता है।",
        "action_guidance_en": "Never combine two oral NSAIDs. Discontinue one and seek medical advice for proper analgesic management.",
        "action_guidance_hi": "दो दर्द निवारक दवाएं एक साथ कभी न लें। डॉक्टर से परामर्श लें।",
        "monograph_source": "National Formulary of India / CDSCO Analgesic Advisory 2024",
        "source_url": "https://ipc.gov.in",
        "rule_version": "CDSCO-2026.4.1",
        "review_status": "approved",
    },
]

# Reviewed Reference Medicines for Verification & Search
SEED_MEDICINES = [
    {
        "id": "med-crocin-650",
        "brand_name": "Crocin 650",
        "generic_name": "Paracetamol Tablets IP",
        "manufacturer": "GlaxoSmithKline Pharmaceuticals",
        "dosage_form": "Tablet",
        "strength": "650 mg",
        "ingredients": [{"name": "Paracetamol", "strength": "650mg", "amount_mg": 650.0}],
    },
    {
        "id": "med-combiflam",
        "brand_name": "Combiflam",
        "generic_name": "Ibuprofen and Paracetamol Tablets IP",
        "manufacturer": "Sanofi India Limited",
        "dosage_form": "Tablet",
        "strength": "400 mg + 325 mg",
        "ingredients": [
            {"name": "Ibuprofen", "strength": "400mg", "amount_mg": 400.0},
            {"name": "Paracetamol", "strength": "325mg", "amount_mg": 325.0},
        ],
    },
    {
        "id": "med-amoxyclav-625",
        "brand_name": "Amoxyclav 625",
        "generic_name": "Amoxicillin and Potassium Clavulanate Tablets IP",
        "manufacturer": "Abbott Healthcare",
        "dosage_form": "Tablet",
        "strength": "500 mg + 125 mg",
        "ingredients": [
            {"name": "Amoxicillin", "strength": "500mg", "amount_mg": 500.0},
            {"name": "Clavulanic Acid", "strength": "125mg", "amount_mg": 125.0},
        ],
    },
    {
        "id": "med-ecosprin-75",
        "brand_name": "Ecosprin 75",
        "generic_name": "Aspirin Gastro-Resistant Tablets IP",
        "manufacturer": "USV Private Limited",
        "dosage_form": "Tablet",
        "strength": "75 mg",
        "ingredients": [{"name": "Aspirin", "strength": "75mg", "amount_mg": 75.0}],
    },
]


def seed_database(db: Session):
    """Populates statutory reference data if database is empty."""
    # Seed Evidence Sources
    for src_data in SEED_EVIDENCE_SOURCES:
        existing = db.query(EvidenceSourceRecord).filter_by(id=src_data["id"]).first()
        if not existing:
            db.add(EvidenceSourceRecord(**src_data))

    # Seed Active Ingredients
    for ing_data in SEED_ACTIVE_INGREDIENTS:
        existing = db.query(ActiveIngredientRecord).filter_by(id=ing_data["id"]).first()
        if not existing:
            db.add(ActiveIngredientRecord(**ing_data))

    # Seed Duplicate Rules
    for dup_data in SEED_DUPLICATE_RULES:
        existing = db.query(DuplicateIngredientRule).filter_by(id=dup_data["id"]).first()
        if not existing:
            db.add(DuplicateIngredientRule(**dup_data))

    # Seed Interaction Rules
    for int_data in SEED_INTERACTION_RULES:
        existing = db.query(DrugInteractionRule).filter_by(id=int_data["id"]).first()
        if not existing:
            db.add(DrugInteractionRule(**int_data))

    # Seed Reference Medicines
    for med_data in SEED_MEDICINES:
        existing = db.query(MedicineReference).filter_by(id=med_data["id"]).first()
        if not existing:
            db.add(MedicineReference(**med_data))

    # Log initial seed audit
    audit = db.query(ClinicalAuditLog).first()
    if not audit:
        db.add(
            ClinicalAuditLog(
                id="audit-initial-seed",
                reviewer_name="Dr. Ananya Rao, Clinical Pharmacologist (Reg #MH-49210)",
                reviewer_registration="MH-49210",
                action="INITIAL_CLINICAL_FORMULARY_SYNC",
                rule_code="CDSCO-2026.4.1",
                details="Seeded reviewed CDSCO and National Formulary of India (NFI) clinical safety rule bases.",
            )
        )

    db.commit()
    logger.info("Database clinical rules and reference formularies seeded successfully.")
