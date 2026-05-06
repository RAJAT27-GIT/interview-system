from fastapi import APIRouter, HTTPException, Depends, Header
from app.database import users_collection, questions_collection, activity_collection
from app.models import QuestionCreate, QuestionResponse, ActivityLog
from app.auth_utils import decode_access_token
from typing import List
from bson import ObjectId

router = APIRouter(prefix="/admin", tags=["admin"])

async def get_admin(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden: Admin access required")
    
    return payload

@router.get("/users")
async def get_users(admin=Depends(get_admin)):
    users = await users_collection.find({}, {"password": 0}).to_list(100)
    for u in users:
        u["_id"] = str(u["_id"])
    return users

@router.get("/activity")
async def get_activity(admin=Depends(get_admin)):
    activities = await activity_collection.find().sort("timestamp", -1).to_list(100)
    for a in activities:
        a["_id"] = str(a["_id"])
    return activities

@router.delete("/activity")
async def clear_activity(admin=Depends(get_admin)):
    await activity_collection.delete_many({})
    return {"status": "success", "message": "All activity logs cleared"}

@router.get("/questions", response_model=List[QuestionResponse])
async def get_questions(admin=Depends(get_admin)):
    questions = await questions_collection.find().to_list(100)
    for q in questions:
        q["_id"] = str(q["_id"])
    return questions

@router.post("/questions", response_model=QuestionResponse)
async def add_question(question: QuestionCreate, admin=Depends(get_admin)):
    q_dict = question.dict()
    result = await questions_collection.insert_one(q_dict)
    q_dict["_id"] = str(result.inserted_id)
    return q_dict

@router.delete("/questions/{q_id}")
async def delete_question(q_id: str, admin=Depends(get_admin)):
    result = await questions_collection.delete_one({"_id": ObjectId(q_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"status": "success"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, admin=Depends(get_admin)):
    result = await users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success"}
