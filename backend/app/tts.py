from gtts import gTTS
import os, tempfile
from fastapi.responses import FileResponse

# ✅ Safe temp folder (OneDrive issue fix)
TTS_OUTPUT_DIR = os.path.join(tempfile.gettempdir(), "interview_tts")
os.makedirs(TTS_OUTPUT_DIR, exist_ok=True)

def generate_tts(text: str, lang: str = 'en') -> str:
    # ✅ Unique filename banate hain temp folder me
    filename = os.path.join(TTS_OUTPUT_DIR, f"tts_{abs(hash(text))}.mp3")

    tts = gTTS(text=text, lang=lang)
    tts.save(filename)  # ✅ Yaha ab koi permission error nahi aayega
    return filename
