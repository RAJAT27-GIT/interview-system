from fastapi import APIRouter, UploadFile, File, Form
import json
from app.tts import generate_tts
from app.stt import transcribe_audio
from app.evaluator import evaluate_answer
from app.feedback import generate_feedback
from app.leaderboard import add_score

router = APIRouter()

@router.post('/interview')
async def run_interview(
    user_name: str = Form(...),
    model_answer_data: str = Form(...),
    user_audio: UploadFile = File(...)
):
    # Parse model answer JSON string
    model_answer_parsed = json.loads(model_answer_data)

    # 1️⃣ Transcribe audio
    user_text = await transcribe_audio(user_audio)

    # 2️⃣ Evaluate
    evaluation_result = evaluate_answer(user_text, model_answer_parsed)

    # 3️⃣ Feedback
    feedback_text = generate_feedback(evaluation_result['final_score'])

    # 4️⃣ Leaderboard update
    add_score(user_name, evaluation_result['final_score'])

    # 5️⃣ Generate TTS feedback
    tts_file = generate_tts(feedback_text)

    return {
        'user_transcript': user_text,
        'evaluation': evaluation_result,
        'feedback': feedback_text,
        'tts_file': tts_file
    }
