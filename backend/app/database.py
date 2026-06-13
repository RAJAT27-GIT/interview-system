import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://https://interview-system-1.onrender.com:27017")
DB_NAME = os.getenv("DB_NAME", "interview_system")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
questions_collection = db["questions"]
activity_collection = db["activity"]
interview_sessions_collection = db["interview_sessions"]

async def ping_db():
    try:
        await client.admin.command('ping')
        print("Successfully connected to MongoDB")
    except Exception as e:
        print(f"Could not connect to MongoDB: {e}")
