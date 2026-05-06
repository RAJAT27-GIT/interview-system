import random
import json
import os
from typing import List, Dict
import groq

# Path to the shared question bank fallback
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK_PATH = os.path.join(BASE_DIR, "data", "question_bank.json")

# Initialize Groq Client
api_key = os.getenv("GROQ_API_KEY")
if api_key:
    client = groq.Groq(api_key=api_key)
else:
    client = None

def load_bank():
    with open(BANK_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

# ─── Round structure per difficulty level ───
ROUND_STRUCTURE = {
    "easy": [
        {"id": "round_1", "name": "Technical Concepts", "icon": "technical", "question_count": 2, "type": "theory"},
        {"id": "round_2", "name": "Coding Round", "icon": "coding", "question_count": 1, "type": "coding"},
        {"id": "round_3", "name": "HR & Communication", "icon": "hr", "question_count": 2, "type": "theory"},
    ],
    "medium": [
        {"id": "round_1", "name": "Technical Concepts", "icon": "technical", "question_count": 2, "type": "theory"},
        {"id": "round_2", "name": "Aptitude & Logic", "icon": "aptitude", "question_count": 2, "type": "theory"},
        {"id": "round_3", "name": "Coding Round", "icon": "coding", "question_count": 1, "type": "coding"},
        {"id": "round_4", "name": "HR & Communication", "icon": "hr", "question_count": 2, "type": "theory"},
    ],
    "hard": [
        {"id": "round_1", "name": "Technical Concepts", "icon": "technical", "question_count": 3, "type": "theory"},
        {"id": "round_2", "name": "System Design", "icon": "system_design", "question_count": 2, "type": "theory"},
        {"id": "round_3", "name": "Coding Round", "icon": "coding", "question_count": 2, "type": "coding"},
        {"id": "round_4", "name": "DSA Deep Dive", "icon": "dsa", "question_count": 2, "type": "theory"},
        {"id": "round_5", "name": "HR & Communication", "icon": "hr", "question_count": 2, "type": "theory"},
    ],
}


def generate_questions_via_llm(resume_data: Dict, difficulty: str) -> Dict:
    """Uses Groq (Llama 3) to generate resume-tailored interview rounds."""
    if not client:
        raise ValueError("Groq API Key missing or client not initialized.")

    selected_model = "llama-3.3-70b-versatile"
    structure = ROUND_STRUCTURE.get(difficulty, ROUND_STRUCTURE["medium"])
    
    # Build round descriptions for prompt
    round_desc = []
    for r in structure:
        if r["type"] == "coding":
            round_desc.append(f"- '{r['name']}': {r['question_count']} coding problem(s) with starter_code (python/javascript/cpp), test_cases (input/expected_output pairs), and type='coding'")
        else:
            round_desc.append(f"- '{r['name']}': {r['question_count']} question(s) with type='theory'")

    rounds_text = "\n    ".join(round_desc)

    prompt = f"""
    You are an elite technical interviewer. Generate a structured multi-round interview session based on this resume.
    
    CANDIDATE: {resume_data.get('name')}
    SKILLS: {', '.join(resume_data.get('skills', []))}
    DIFFICULTY: {difficulty}
    
    RESUME TEXT:
    {resume_data.get('raw_text', '')[:2500]}
    
    TASK:
    Generate exactly {len(structure)} rounds:
    {rounds_text}
    
    For THEORY questions, provide:
    - "text": Interview question
    - "type": "theory"
    - "model_answer": Ideal response
    - "keywords": 3-4 terms to look for
    - "tags": Relevant topics
    
    For CODING questions, provide:
    - "text": Problem statement with examples
    - "type": "coding"
    - "starter_code": {{ "python": "...", "javascript": "...", "cpp": "..." }}
    - "test_cases": [ {{ "input": "...", "expected_output": "..." }} ] (at least 3 test cases)
    - "model_answer": Brief approach description
    - "keywords": ["algorithm", "approach"]
    - "tags": ["coding"]
    
    OUTPUT:
    Return ONLY a JSON object. No explanation. No markdown.
    Format: {{ "rounds": [ {{ "id": "round_1", "name": "...", "icon": "...", "type": "theory|coding", "questions": [...] }}, ... ] }}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional hiring manager engine that outputs valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=selected_model,
            response_format={"type": "json_object"} if "llama-3.3" in selected_model else None
        )
        
        resp_text = chat_completion.choices[0].message.content.strip()
        data = json.loads(resp_text)
        return data
    except Exception as e:
        print(f"Groq API Error: {e}")
        raise e


def generate_interview_session(resume_data: Dict, difficulty: str = "medium") -> Dict:
    """
    Primary engine for session generation. Uses Groq dynamic generation if available.
    Rounds scale per difficulty: easy=3, medium=4, hard=5
    """
    # 1. Try Groq Dynamic Generation
    if client:
        try:
            return generate_questions_via_llm(resume_data, difficulty)
        except Exception:
            print("Groq failed. Falling back to local bank...")

    # 2. Local Fallback logic
    bank = load_bank()
    user_skills = [s.lower() for s in resume_data.get("skills", [])]
    structure = ROUND_STRUCTURE.get(difficulty, ROUND_STRUCTURE["medium"])
    
    rounds = []
    for round_info in structure:
        round_type = round_info["type"]
        count = round_info["question_count"]
        name = round_info["name"]
        
        if round_type == "coding":
            # Pick coding questions with test cases
            coding_pool = [q for q in bank if q.get("type") == "coding" and q["difficulty"] == difficulty]
            if not coding_pool:
                coding_pool = [q for q in bank if q.get("type") == "coding"]
            questions = random.sample(coding_pool, min(count, len(coding_pool)))
        
        elif "HR" in name or "Communication" in name:
            # Behavioral questions
            behavioral_pool = [q for q in bank if "behavioral" in q.get("tags", [])]
            questions = random.sample(behavioral_pool, min(count, len(behavioral_pool)))
        
        elif "Aptitude" in name:
            # Aptitude/Logic questions
            apt_pool = [q for q in bank if "aptitude" in q.get("tags", []) or "logic" in q.get("tags", [])]
            if not apt_pool:
                apt_pool = [q for q in bank if q.get("type") == "theory" and q["difficulty"] == difficulty]
            questions = random.sample(apt_pool, min(count, len(apt_pool)))
        
        elif "System Design" in name:
            # System design questions
            sd_pool = [q for q in bank if "system design" in q.get("tags", [])]
            if not sd_pool:
                sd_pool = [q for q in bank if q["difficulty"] == "hard" and q.get("type") == "theory"]
            questions = random.sample(sd_pool, min(count, len(sd_pool)))
        
        elif "DSA" in name:
            # DSA deep dive
            dsa_pool = [q for q in bank if "dsa" in q.get("tags", []) and q.get("type") == "theory"]
            if not dsa_pool:
                dsa_pool = [q for q in bank if q["difficulty"] == "hard" and q.get("type") == "theory"]
            questions = random.sample(dsa_pool, min(count, len(dsa_pool)))
        
        else:
            # Technical questions - match to resume skills
            tech_pool = [q for q in bank if q["difficulty"] == difficulty and q.get("type") == "theory"
                         and "behavioral" not in q.get("tags", []) and "aptitude" not in q.get("tags", [])]
            matched = [q for q in tech_pool if any(tag.lower() in user_skills for tag in q.get("tags", []))]
            if len(matched) >= count:
                questions = random.sample(matched, count)
            else:
                needed = count - len(matched)
                others = [q for q in tech_pool if q not in matched]
                questions = matched + random.sample(others, min(needed, len(others)))
        
        rounds.append({
            "id": round_info["id"],
            "name": name,
            "icon": round_info["icon"],
            "type": round_type,
            "questions": questions
        })
    
    return {"rounds": rounds}
