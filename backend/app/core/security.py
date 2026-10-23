import os
import re
import uuid
from typing import Tuple


def sanitize_filename(filename: str) -> str:
    """Sanitizes filename against path traversal and returns safe unique name."""
    clean_name = os.path.basename(filename)
    # Strip any characters outside alphanumerics, dots, dashes, underscores
    clean_name = re.sub(r"[^a-zA-Z0-9_.-]", "_", clean_name)
    ext = os.path.splitext(clean_name)[1].lower()
    unique_prefix = uuid.uuid4().hex[:12]
    return f"{unique_prefix}_{clean_name}" if ext else f"{unique_prefix}.bin"


def validate_file_extension(filename: str, allowed_extensions: Tuple[str, ...] = (".jpg", ".jpeg", ".png", ".webp")) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    return ext in allowed_extensions


def scrub_sensitive_phi(text: str) -> str:
    """Removes patient identifiers (phone numbers, emails) from server logging output."""
    # Mask Indian mobile numbers
    text = re.sub(r"\b(?:\+91|0)?[6-9]\d{9}\b", "[REDACTED_PHONE]", text)
    # Mask email addresses
    text = re.sub(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", "[REDACTED_EMAIL]", text)
    return text
