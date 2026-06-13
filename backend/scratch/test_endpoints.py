import requests
import json

BASE_URL = "http://https://interview-system-1.onrender.com:8000"

def test_auth():
    print("Testing Registration...")
    try:
        reg_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123",
            "role": "user"
        }
        res = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
        print(f"Status: {res.status_code}, Body: {res.text}")
        
        print("\nTesting Login...")
        login_data = {
            "email": "test@example.com",
            "password": "password123"
        }
        res = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Status: {res.status_code}, Body: {res.text}")
        if res.status_code == 200:
            return res.json()["access_token"]
    except Exception as e:
        print(f"Auth Test Failed: {e}")
    return None

if __name__ == "__main__":
    # Make sure backend is running before running this
    token = test_auth()
    if token:
        print("\nAuth successful, token obtained.")
    else:
        print("\nAuth failed.")
