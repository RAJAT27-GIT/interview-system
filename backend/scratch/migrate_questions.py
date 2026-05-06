import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "interview_system")

async def migrate():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    questions_collection = db["questions"]

    # Get path relative to the backend directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(base_dir, "data", "question_bank.json")
    if not os.path.exists(json_path):
        print(f"JSON file not found at {json_path}")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        questions = json.load(f)

    print(f"Found {len(questions)} questions in JSON.")

    # Check if DB already has questions
    count = await questions_collection.count_documents({})
    if count > 0:
        print(f"DB already has {count} questions. Skipping migration to avoid duplicates.")
        return

    # Insert questions
    if questions:
        result = await questions_collection.insert_many(questions)
        print(f"Successfully migrated {len(result.inserted_ids)} questions to MongoDB.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate())
