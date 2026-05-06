import os 
import tempfile
import traceback
from fastapi import UploadFile
from groq import Groq

# We do not initialize client at top level because os.getenv might be None 
# if this is imported before load_dotenv() in main.py.
# Instead, we will initialize it inside transcription or via a getter.

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    return Groq(api_key=api_key)

async def transcribe_audio(file: UploadFile) -> str:
    """
    Transcribes audio using Groq's high-speed Whisper API.
    """
    client = get_groq_client()
    if not client:
        return "Error: GROQ_API_KEY not found in environment. Please check your .env file."

    tmp_path = None
    try:
        # 1. Handle filename and suffix safely
        filename_str = str(getattr(file, "filename", "audio.webm") or "audio.webm")
        _, extension = os.path.splitext(filename_str)
        suffix = extension if extension else ".webm"
        
        # 2. Save uploaded content to a temporary file
        # We use a context manager to ensure it's closed before we open it for reading
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            if not content:
                return "Error: Received empty audio file."
            tmp.write(content)
            tmp_path = tmp.name

        # 3. Call Groq Whisper API
        # Groq's Whisper API supports: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm
        with open(tmp_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=(filename_str, 
                audio_file.read()),
                model="whisper-large-v3", # Standard model for high accuracy
                response_format="json",
                language="en", 
                temperature=0.0
            )

        return transcription.text

    except Exception as e:
        error_msg = f"STT Runtime Error: {str(e)}"
        print(error_msg)
        traceback.print_exc()
        return error_msg
        
    finally:
        # 4. Strictly cleanup the temporary file
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception as cleanup_err:
                print(f"Failed to cleanup STT temp file: {cleanup_err}")
