import os
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env.local", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "DawaLens Safety Engine API"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS Configuration
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # Database: SQLite default for local development, PostgreSQL in production
    DATABASE_URL: str = "sqlite:///./dawalens.db"

    # AI / Vision Model Configuration
    # Supported: "gemma_4", "huggingface", "ollama", "test"
    AI_PROVIDER: str = "gemma_4"
    GEMMA_MODEL_ID: str = "gemini-3.5-flash-lite"
    GEMMA_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    GEMMA_API_ENDPOINT: str = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent"

    @property
    def effective_api_key(self) -> str:
        """Returns the first non-empty API key from GEMMA_API_KEY, GOOGLE_API_KEY, or GEMINI_API_KEY."""
        return (
            self.GEMMA_API_KEY
            or self.GOOGLE_API_KEY
            or self.GEMINI_API_KEY
            or os.environ.get("GEMMA_API_KEY", "")
            or os.environ.get("GOOGLE_API_KEY", "")
            or os.environ.get("GEMINI_API_KEY", "")
        ).strip()

    # Image upload limits and safeguards
    MAX_UPLOAD_SIZE_MB: int = 15
    MAX_IMAGE_COUNT_PER_SCAN: int = 5
    ALLOWED_IMAGE_TYPES: List[str] = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ]
    TEMP_UPLOAD_DIR: str = "./temp_uploads"
    DELETE_TEMP_IMAGES_AFTER_PROCESSING: bool = True

    # Clinical Formulary Knowledge Base Version
    CLINICAL_RULE_VERSION: str = "CDSCO-2026.4.1"


settings = Settings()
