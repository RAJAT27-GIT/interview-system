import os
import sys

# Add current dir to path
sys.path.append(os.getcwd())

try:
    from app.stt import transcribe_audio
    print("Import successful")
except Exception as e:
    print(f"Import failed: {e}")
