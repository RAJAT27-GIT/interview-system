try:
    import fastapi
    print("fastapi ok")
    import motor
    print("motor ok")
    import bcrypt
    print("bcrypt ok")
    import jwt
    print("jwt ok")
    import groq
    print("groq ok")
    from app.database import ping_db
    print("database ok")
    from app.models import ActivityLog
    print("models ok")
    print("All imports successful!")
except Exception as e:
    print(f"Import failed: {e}")
    import traceback
    traceback.print_exc()
