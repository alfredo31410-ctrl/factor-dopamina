from pathlib import Path
import os

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(ROOT_DIR / ".env")


class Settings:
    MONGO_URL: str = os.environ["MONGO_URL"]
    DB_NAME: str = os.environ["DB_NAME"]

    JWT_SECRET: str = os.environ["JWT_SECRET"]
    JWT_ALGORITHM: str = "HS256"

    ADMIN_EMAIL: str = os.environ["ADMIN_EMAIL"]
    ADMIN_PASSWORD: str = os.environ["ADMIN_PASSWORD"]

    EMERGENT_LLM_KEY: str = os.environ.get("EMERGENT_LLM_KEY", "")
    APP_NAME: str = os.environ.get("APP_NAME", "factordopamina")

    STORAGE_URL: str = "https://integrations.emergentagent.com/objstore/api/v1/storage"

    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.environ.get("CORS_ORIGINS", "*").split(",")
        if origin.strip()
    ]


settings = Settings()