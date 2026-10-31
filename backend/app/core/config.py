"""
Settings
--------
All configuration lives in ONE place. Values come from the ".env" file
(or real environment variables). Nothing secret is written in the code.
"""
from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/.env  (two folders above this file: core -> app -> backend)
ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, extra="ignore")

    # --- MongoDB ---
    mongodb_uri: str
    mongodb_db_name: str = "giftora"

    # --- JWT login tokens ---
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 1 day

    # --- CORS (comma separated list of allowed websites) ---
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # --- Shop rules (same numbers the frontend Cart page uses) ---
    free_shipping_threshold: float = 80.0
    standard_shipping_fee: float = 9.99

    @field_validator("jwt_secret_key")
    @classmethod
    def secret_must_be_strong(cls, value: str) -> str:
        if len(value) < 32:
            raise ValueError(
                "JWT_SECRET_KEY must be at least 32 characters. Generate one with: "
                'python -c "import secrets; print(secrets.token_urlsafe(48))"'
            )
        return value

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    """Create the settings once and reuse them."""
    return Settings()
