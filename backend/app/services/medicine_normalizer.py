import re
from typing import Dict, Optional, Tuple

# Reviewed Pharmacological Salt Synonym Normalization Map
CANONICAL_SALT_SYNONYMS: Dict[str, str] = {
    # Paracetamol / Acetaminophen
    "acetaminophen": "Paracetamol",
    "apap": "Paracetamol",
    "paracetamol ip": "Paracetamol",
    "paracetamol bp": "Paracetamol",
    "paracetamol usp": "Paracetamol",
    "paracetamol": "Paracetamol",
    "paracetemol": "Paracetamol",
    # Aspirin
    "acetylsalicylic acid": "Aspirin",
    "aspirin ip": "Aspirin",
    "aspirin": "Aspirin",
    "asa": "Aspirin",
    # Ibuprofen
    "ibuprofen ip": "Ibuprofen",
    "ibuprofen": "Ibuprofen",
    "ibuprophen": "Ibuprofen",
    # Amoxicillin
    "amoxicillin": "Amoxicillin",
    "amoxycillin": "Amoxicillin",
    "amoxicillin trihydrate": "Amoxicillin",
    # Clavulanic Acid
    "clavulanic acid": "Clavulanic Acid",
    "potassium clavulanate": "Clavulanic Acid",
    "clavulanate potassium": "Clavulanic Acid",
    # Metformin
    "metformin hydrochloride": "Metformin",
    "metformin hcl": "Metformin",
    "metformin": "Metformin",
    # Atorvastatin
    "atorvastatin calcium": "Atorvastatin",
    "atorvastatin": "Atorvastatin",
    # Pantoprazole
    "pantoprazole sodium": "Pantoprazole",
    "pantoprazole": "Pantoprazole",
    # Diclofenac
    "diclofenac sodium": "Diclofenac",
    "diclofenac potassium": "Diclofenac",
    "diclofenac": "Diclofenac",
}


class MedicineNormalizer:
    @staticmethod
    def normalize_ingredient_name(raw_name: str) -> str:
        """
        Normalizes variations and salt derivatives to the official WHO/CDSCO canonical International Nonproprietary Name (INN).
        Example: "Acetaminophen" -> "Paracetamol", "Amoxycillin" -> "Amoxicillin".
        Time Complexity: O(1) hash lookup after string strip.
        """
        if not raw_name:
            return "Unknown"
        clean = re.sub(r"[\(\)\[\]\{\}]", "", raw_name).strip().lower()
        # Direct dictionary synonym match
        if clean in CANONICAL_SALT_SYNONYMS:
            return CANONICAL_SALT_SYNONYMS[clean]

        # Suffix stripping (e.g. "Paracetamol 650mg" -> "Paracetamol")
        for synonym, canonical in CANONICAL_SALT_SYNONYMS.items():
            if clean.startswith(synonym):
                return canonical

        # Titlecase clean name if no synonym mapped
        return raw_name.strip().title()

    @staticmethod
    def parse_strength_mg(strength_str: str) -> Optional[float]:
        """
        Extracts numerical mass in milligrams (mg) from strength labels.
        Example: "650 mg" -> 650.0, "1 g" -> 1000.0, "500 mcg" -> 0.5.
        """
        if not strength_str:
            return None

        clean = strength_str.lower().strip()

        # Grams to mg
        gram_match = re.search(r"(\d+(?:\.\d+)?)\s*g\b", clean)
        if gram_match and "mg" not in clean:
            return float(gram_match.group(1)) * 1000.0

        # Micrograms to mg
        mcg_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:mcg|µg)\b", clean)
        if mcg_match:
            return float(mcg_match.group(1)) / 1000.0

        # Milligrams
        mg_match = re.search(r"(\d+(?:\.\d+)?)\s*mg\b", clean)
        if mg_match:
            return float(mg_match.group(1))

        # Plain number fallback
        plain_match = re.search(r"(\d+(?:\.\d+)?)", clean)
        if plain_match:
            return float(plain_match.group(1))

        return None


medicine_normalizer = MedicineNormalizer()
