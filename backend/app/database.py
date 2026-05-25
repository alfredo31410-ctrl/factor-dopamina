from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings


client = AsyncIOMotorClient(settings.MONGO_URL)
db = client[settings.DB_NAME]


def close_database_connection() -> None:
    client.close()