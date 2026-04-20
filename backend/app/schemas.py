from pydantic import BaseModel, Field
from typing import Optional, List, Union
from datetime import datetime

class InteractionBase(BaseModel):
    doctor_name: str
    interaction_type: str
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    key_topics: Optional[str] = None
    raw_text: Optional[str] = None
    outcome: Optional[str] = None

class InteractionCreate(InteractionBase):
    pass

class InteractionUpdate(BaseModel):
    doctor_name: Optional[str] = None
    interaction_type: Optional[str] = None
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    key_topics: Optional[str] = None
    raw_text: Optional[str] = None
    outcome: Optional[str] = None

class InteractionResponse(InteractionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class APIResponse(BaseModel):
    success: bool
    data: Optional[Union[dict, list, InteractionResponse]] = None
    message: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
