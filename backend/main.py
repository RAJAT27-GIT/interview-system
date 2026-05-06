from fastapi import FastAPI, File, UploadFile, Query, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
import subprocess
import tempfile
import json
from fastapi import Request
from dotenv import load_dotenv

# Load environment variables (API Keys, etc.)
load_dotenv()

# Ensure the backend directory is in the Python path for IDE checks
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# ✅ Import from app folder
from app.resume_parser import parse_resume
from app.interview_engine import generate_interview_session
from app.qbank import get_questions_by_tier
from app.qgen import generate_question_variation
from app.tts import generate_tts
from app.stt import transcribe_audio
from app.evaluator import evaluate_answer
from app.feedback import generate_feedback
from app.leaderboard import add_score, get_leaderboard
from app.interview import router as interview_router
from app.auth import router as auth_router
from app.admin import router as admin_router
from app.database import ping_db, activity_collection, users_collection
from app.models import ActivityLog, SubmitInterviewRequest
from app.auth_utils import decode_access_token
from fastapi import HTTPException, Depends, Header

# ✅ Single FastAPI instance
app = FastAPI()

# ✅ CORS FIX — allows React frontend (localhost:5173) to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await ping_db()

@app.post('/parse_resume')
async def parse_resume_file(file: UploadFile = File(...)):
    contents = await file.read()
    parsed = parse_resume(contents)
    
    # Log Activity
    await activity_collection.insert_one(ActivityLog(
        action="upload_resume",
        details={"filename": file.filename}
    ).dict())
    
    return parsed


@app.post('/start_interview')
async def start_interview_endpoint(
    user_name: str = Form(...),
    difficulty: str = Form("medium"),
    file: UploadFile = File(...)
):
    # 1. Parse Resume
    contents = await file.read()
    parsed_resume = parse_resume(contents)
    
    # 2. Generate Multi-Round Session
    # Map tier name to difficulty if UI sends tier1/2/3
    diff_map = {"tier1": "hard", "tier2": "medium", "tier3": "easy"}
    final_diff = diff_map.get(difficulty.lower(), difficulty.lower())
    
    session = generate_interview_session(parsed_resume, final_diff)
    
    # Log Activity
    await activity_collection.insert_one(ActivityLog(
        user_name=user_name,
        action="start_interview",
        details={"difficulty": final_diff, "resume_name": parsed_resume.get("name")}
    ).dict())
    
    return {
        "user_name": user_name,
        "parsed_resume": {
            "name": parsed_resume.get("name"),
            "skills": parsed_resume.get("skills")
        },
        "session": session
    }


@app.get('/questions')
async def get_questions(
    tier: str = Query(..., description="tier1/tier2/tier3"),
    topic: str = Query(None, description="optional topic"),
    count: int = Query(1, description="number of questions")
):
    questions = await get_questions_by_tier(tier, topic, count)
    return questions


@app.get('/generate_questions')
async def generate_questions(
    tier: str = Query(...),
    topic: str = Query(None),
    count: int = Query(1),
    variations: int = Query(1)
):
    base_questions = await get_questions_by_tier(tier, topic, count)
    generated = []
    for q in base_questions:
        var_texts = generate_question_variation(q['text'], variations)
        for vt in var_texts:
            generated.append({
                'id': q['id'],
                'original_text': q['text'],
                'generated_text': vt,
                'difficulty': q['difficulty'],
                'tags': q['tags']
            })
    return generated


@app.get('/tts')
async def tts_endpoint(text: str = Query(...), lang: str = Query('en')):
    audio_file = generate_tts(text, lang)
    return FileResponse(audio_file, media_type='audio/mpeg', filename=os.path.basename(audio_file))


@app.post('/stt')
async def stt_endpoint(file: UploadFile = File(...)):
    text = await transcribe_audio(file)
    return {"transcript": text}


# ✅ Evaluate endpoint
@app.post("/evaluate")
async def evaluate_endpoint(request: Request):
    data = await request.json()
    user_answer = data.get("user_answer", "")
    model_answer_data = data.get("model_answer", {})

    if not isinstance(model_answer_data, dict):
        model_answer_data = {"model_answer": model_answer_data or ""}

    result = evaluate_answer(user_answer, model_answer_data)
    return result


# ✅ Feedback endpoint — accepts JSON body
@app.post('/feedback')
async def feedback_endpoint(request: Request):
    data = await request.json()
    final_score = data.get("final_score", 0)
    feedback_text = generate_feedback(final_score)
    return {"feedback": feedback_text}


@app.post('/add_score')
async def add_score_endpoint(request: Request):
    data = await request.json()
    user_name = data.get("user_name", "Anonymous")
    score = data.get("score", 0)
    add_score(user_name, score)
    return {"status": "success"}


@app.get('/leaderboard')
async def leaderboard_endpoint(top_n: int = 10):
    leaderboard_data = get_leaderboard(top_n)
    return leaderboard_data


async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload


@app.post('/submit_interview')
async def submit_interview(request: SubmitInterviewRequest, current_user=Depends(get_current_user)):
    email = current_user.get("sub")
    await users_collection.update_one(
        {"email": email},
        {"$set": {
            "latest_score": request.score,
            "auto_submitted": request.auto_submitted,
            "violations": request.violations
        }}
    )
    return {"status": "success"}


# ✅ Code Evaluation endpoint — runs user code against test cases
@app.post('/evaluate_code')
async def evaluate_code_endpoint(request: Request):
    data = await request.json()
    code = data.get("code", "")
    language = data.get("language", "python")
    test_cases = data.get("test_cases", [])
    
    results = []
    passed = 0
    total = len(test_cases)
    
    for i, tc in enumerate(test_cases):
        tc_input = tc.get("input", "")
        expected = tc.get("expected_output", "").strip()
        
        try:
            if language == "python":
                # Wrap user code to execute with test input
                full_code = code + f"\n\n# --- Auto Test ---\nresult = {_get_python_call(code, tc_input)}\nprint(result)"
                result = _run_code_safe(full_code, "python", language="python")
            elif language == "javascript":
                full_code = code + f"\n\n// --- Auto Test ---\nconsole.log({_get_js_call(code, tc_input)})"
                result = _run_code_safe(full_code, "node", language="javascript")
            else:
                result = {"output": "", "error": "Language not supported for auto-evaluation", "timeout": False}
            
            actual_output = result["output"].strip()
            is_pass = _compare_outputs(actual_output, expected)
            
            if is_pass:
                passed += 1
            
            results.append({
                "test_num": i + 1,
                "input": tc_input,
                "expected": expected,
                "actual": actual_output,
                "passed": is_pass,
                "error": result.get("error", "")
            })
        except Exception as e:
            results.append({
                "test_num": i + 1,
                "input": tc_input,
                "expected": expected,
                "actual": "",
                "passed": False,
                "error": str(e)
            })
    
    score = int((passed / total) * 100) if total > 0 else 0
    
    return {
        "results": results,
        "passed": passed,
        "total": total,
        "score": score,
        "final_score": score
    }


def _get_python_call(code: str, test_input: str) -> str:
    """Extract function name from Python code and create a call with test input."""
    for line in code.split("\n"):
        line = line.strip()
        if line.startswith("def "):
            func_name = line.split("(")[0].replace("def ", "").strip()
            return f"{func_name}({test_input})"
    return f"eval('{test_input}')"


def _get_js_call(code: str, test_input: str) -> str:
    """Extract function name from JS code and create a call with test input."""
    for line in code.split("\n"):
        line = line.strip()
        if line.startswith("function "):
            func_name = line.split("(")[0].replace("function ", "").strip()
            return f"{func_name}({test_input})"
    return test_input


def _compare_outputs(actual: str, expected: str) -> bool:
    """Flexible comparison of outputs."""
    actual = actual.strip().lower()
    expected = expected.strip().lower()
    
    # Direct match
    if actual == expected:
        return True
    
    # Try parsing as Python-like values
    replacements = {
        "true": "True", "false": "False", "null": "None",
        "undefined": "None"
    }
    a = actual
    e = expected
    for k, v in replacements.items():
        a = a.replace(k, v)
        e = e.replace(k, v)
    
    try:
        import ast
        return ast.literal_eval(a) == ast.literal_eval(e)
    except:
        pass
    
    return actual == expected


def _run_code_safe(code: str, runtime: str, language: str = "python") -> dict:
    """Run code in a subprocess with timeout for safety."""
    ext = ".py" if language == "python" else ".js"
    
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix=ext, delete=False, encoding='utf-8') as f:
            f.write(code)
            f.flush()
            temp_path = f.name
        
        result = subprocess.run(
            [runtime, temp_path],
            capture_output=True,
            text=True,
            timeout=10,
            cwd=os.path.dirname(temp_path)
        )
        
        return {
            "output": result.stdout,
            "error": result.stderr if result.returncode != 0 else "",
            "timeout": False
        }
    except subprocess.TimeoutExpired:
        return {"output": "", "error": "Time Limit Exceeded (10s)", "timeout": True}
    except Exception as e:
        return {"output": "", "error": str(e), "timeout": False}
    finally:
        try:
            os.unlink(temp_path)
        except:
            pass


# ✅ Include routers
app.include_router(interview_router)
app.include_router(auth_router)
app.include_router(admin_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

