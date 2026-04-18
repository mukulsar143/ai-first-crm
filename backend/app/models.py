from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.sql import func
from .database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    doctor_name = Column(String, index=True)
    interaction_type = Column(String)
    summary = Column(Text)
    sentiment = Column(String)
    key_topics = Column(Text)  # Stored as comma-separated or JSON string
    raw_text = Column(Text)
    outcome = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
