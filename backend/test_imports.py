import os
import sys
# Ensure the backend directory is in the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

print("Starting imports...")
try:
    from main import app
    print("Successfully imported app from main.py")
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Import failed: {e}")
