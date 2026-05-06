
import os
import tempfile
from fastapi import UploadFile
import asyncio

async def test():
    # Mock UploadFile
    class MockFile:
        def __init__(self, filename):
            self.filename = filename
        async def read(self):
            return b"test content"

    file = None
    
    # Logic from stt.py
    original_filename = getattr(file, "filename", "audio.webm") or "audio.webm"
    print(f"Original filename: {original_filename}")
    suffix = os.path.splitext(original_filename)[1] or ".webm"
    print(f"Suffix: {suffix}")

asyncio.run(test())
