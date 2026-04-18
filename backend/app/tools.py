from langchain_core.tools import tool
from sqlalchemy.orm import Session
from .database import SessionLocal
from . import models, schemas
import json
from typing import List, Optional

@tool
def log_interaction_tool(doctor_name: str, interaction_type: str, summary: str, sentiment: str, key_topics: str, raw_text: str, outcome: Optional[str] = None):
    """Logs a new interaction with an HCP. Use this when the user describes a meeting or interaction."""
    db = SessionLocal()
    try:
        db_interaction = models.Interaction(
            doctor_name=doctor_name,
            interaction_type=interaction_type,
            summary=summary,
            sentiment=sentiment,
            key_topics=key_topics,
            raw_text=raw_text,
            outcome=outcome
        )
        db.add(db_interaction)
        db.commit()
        db.refresh(db_interaction)
        return json.dumps({"status": "success", "id": db_interaction.id, "doctor_name": db_interaction.doctor_name})
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()

@tool
def edit_interaction_tool(interaction_id: int, updates: dict):
    """Edits an existing interaction record. 'updates' is a dictionary of fields to change."""
    db = SessionLocal()
    try:
        db_interaction = db.query(models.Interaction).filter(models.Interaction.id == interaction_id).first()
        if not db_interaction:
            return json.dumps({"status": "error", "message": "Interaction not found"})
        
        for key, value in updates.items():
            if hasattr(db_interaction, key):
                setattr(db_interaction, key, value)
        
        db.commit()
        db.refresh(db_interaction)
        return json.dumps({"status": "success", "id": db_interaction.id})
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()

@tool
def get_interactions_tool(doctor_name: Optional[str] = None):
    """Fetches interactions. Optionally filter by doctor name."""
    db = SessionLocal()
    try:
        query = db.query(models.Interaction)
        if doctor_name:
            query = query.filter(models.Interaction.doctor_name.ilike(f"%{doctor_name}%"))
        
        interactions = query.all()
        result = []
        for i in interactions:
            result.append({
                "id": i.id,
                "doctor_name": i.doctor_name,
                "interaction_type": i.interaction_type,
                "summary": i.summary,
                "sentiment": i.sentiment,
                "created_at": i.created_at.isoformat() if i.created_at else None
            })
        return json.dumps(result)
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()

@tool
def suggest_followup_tool(interaction_id: int):
    """Suggests follow-up actions for a specific interaction based on its summary."""
    # This tool will likely be called by the LLM after it reads the summary
    db = SessionLocal()
    try:
        db_interaction = db.query(models.Interaction).filter(models.Interaction.id == interaction_id).first()
        if not db_interaction:
            return json.dumps({"status": "error", "message": "Interaction not found"})
        
        # In a real scenario, we might use the LLM to generate this.
        # For the tool implementation, we return the context for the AI to process.
        return json.dumps({
            "doctor_name": db_interaction.doctor_name,
            "summary": db_interaction.summary,
            "sentiment": db_interaction.sentiment,
            "last_interaction": db_interaction.created_at.isoformat() if db_interaction.created_at else None
        })
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()

@tool
def insights_tool():
    """Provides broad insights and trends across all interactions (e.g., sentiment distribution)."""
    db = SessionLocal()
    try:
        interactions = db.query(models.Interaction).all()
        if not interactions:
            return json.dumps({"message": "No interactions found to analyze."})
        
        sentiments = {}
        types = {}
        for i in interactions:
            sentiments[i.sentiment] = sentiments.get(i.sentiment, 0) + 1
            types[i.interaction_type] = types.get(i.interaction_type, 0) + 1
            
        return json.dumps({
            "total_interactions": len(interactions),
            "sentiment_distribution": sentiments,
            "interaction_type_distribution": types
        })
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        db.close()
