from fastapi import APIRouter, HTTPException, Depends, status
from app.database import users_collection, activity_collection
from app.models import UserCreate, LoginRequest, Token, ActivityLog
from app.auth_utils import hash_password, verify_password, create_access_token
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

ADMIN_SECRET = os.getenv("ADMIN_SECRET")
router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check admin secret if role is admin
    if user.role == "admin":
        if user.admin_secret != ADMIN_SECRET:
            raise HTTPException(status_code=403, detail="Invalid admin secret key")

    # Hash password
    hashed = hash_password(user.password)
    
    # Create user
    user_dict = user.dict(exclude={"admin_secret"})
    user_dict["password"] = hashed
    result = await users_collection.insert_one(user_dict)
    
    # Log activity
    await activity_collection.insert_one(ActivityLog(
        user_id=str(result.inserted_id),
        user_name=user.name,
        action="register",
        details={"email": user.email}
    ).dict())
    
    # Generate token
    access_token = create_access_token(data={"sub": user.email, "role": user.role, "name": user.name})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role, "name": user.name}

@router.post("/login", response_model=Token)
async def login(credentials: LoginRequest):
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if user.get("role", "user") != credentials.role:
        raise HTTPException(status_code=403, detail=f"Account is registered as {user.get('role', 'user')}, not {credentials.role}")
        
    if credentials.role == "admin":
        if credentials.admin_secret != ADMIN_SECRET:
            raise HTTPException(status_code=403, detail="Invalid admin secret key")
    
    # Log activity
    await activity_collection.insert_one(ActivityLog(
        user_id=str(user["_id"]),
        user_name=user["name"],
        action="login",
        details={"email": user["email"]}
    ).dict())
    
    # Generate token
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"], "name": user["name"]})
    return {"access_token": access_token, "token_type": "bearer", "role": user["role"], "name": user["name"]}


