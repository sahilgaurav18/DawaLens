from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.db.session import Base


class ActiveIngredientRecord(Base):
    __tablename__ = "active_ingredients"

    id = Column(String, primary_key=True, index=True)
    canonical_name = Column(String, unique=True, index=True, nullable=False)
    aliases = Column(JSON, default=list)  # e.g. ["Acetaminophen", "APAP", "Paracetamol IP"]
    anatomical_class = Column(String, nullable=True)  # e.g. "Analgesic / Antipyretic"
    standard_single_dose_limit_mg = Column(Float, nullable=True)  # e.g. 1000.0 mg
    daily_ceiling_limit_mg = Column(Float, nullable=True)  # e.g. 4000.0 mg
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class MedicineReference(Base):
    __tablename__ = "medicine_references"

    id = Column(String, primary_key=True, index=True)
    brand_name = Column(String, index=True, nullable=False)
    generic_name = Column(String, nullable=True)
    manufacturer = Column(String, nullable=True)
    dosage_form = Column(String, nullable=False)  # Tablet, Capsule, Syrup
    strength = Column(String, nullable=False)  # e.g. "650 mg"
    ingredients = Column(JSON, default=list)  # List of {name, strength, amount_mg}
    rx_required = Column(String, default="Schedule H")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class BrandMapping(Base):
    __tablename__ = "brand_mappings"

    id = Column(String, primary_key=True, index=True)
    raw_brand_name = Column(String, index=True, nullable=False)
    normalized_brand_name = Column(String, nullable=False)
    canonical_ingredients = Column(JSON, default=list)
    confidence = Column(Float, default=1.0)
