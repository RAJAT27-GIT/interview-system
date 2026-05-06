import json
import random
from typing import List, Dict
from app.database import questions_collection
import asyncio

# Load question bank once (as fallback)
JSON_BANK_PATH = "./data/question_bank.json"
try:
    with open(JSON_BANK_PATH, "r", encoding="utf-8") as f:
        QUESTION_BANK: List[Dict] = json.load(f)
except:
    QUESTION_BANK = []

# Map tier to difficulty
TIER_MAPPING = {
    "tier1": "hard",
    "tier2": "medium",
    "tier3": "easy"
}


async def get_questions_by_tier(tier: str, topic: str = None, count: int = 1) -> List[Dict]:
    difficulty = TIER_MAPPING.get(tier.lower())
    if not difficulty:
        return []

    # Try fetching from MongoDB first
    try:
        query = {"difficulty": difficulty}
        if topic:
            query["tags"] = {"$in": [topic]}
        
        db_questions = await questions_collection.find(query).to_list(100)
        if db_questions:
            for q in db_questions:
                q["id"] = str(q["_id"])
            return random.sample(db_questions, min(count, len(db_questions)))
    except Exception as e:
        print(f"Error fetching questions from DB: {e}")

    # Fallback to JSON
    filtered = [q for q in QUESTION_BANK if q['difficulty'] == difficulty]
    if topic:
        filtered = [q for q in filtered if topic.lower() in [t.lower() for t in q.get('tags', [])]]

    if not filtered:
        return []

    return random.sample(filtered, min(count, len(filtered)))