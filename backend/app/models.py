from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "user"  # "user" or "admin"

class UserCreate(UserBase):
    password: str
    admin_secret: Optional[str] = None



class UserResponse(UserBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True

class QuestionBase(BaseModel):
    text: str
    difficulty: str  # "easy", "medium", "hard"
    tags: List[str] = []
    model_answer: Optional[str] = ""

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True

class ActivityLog(BaseModel):
    user_id: Optional[str] = None
    user_name: Optional[str] = "Anonymous"
    action: str  # "login", "register", "upload_resume", "start_interview", "complete_interview"
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: str = "user"
    admin_secret: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str

class SubmitInterviewRequest(BaseModel):
    score: int
    auto_submitted: bool
    violations: int
