import os
import json
import logging
from typing import Optional, Dict, Any
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field
from .database import SessionLocal
from . import models

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InteractionExtraction(BaseModel):
    doctor_name: str = Field(description="The name of the HCP/Doctor")
    interaction_type: str = Field(description="The type of interaction (Meeting, Call, Email, etc.)")
    summary: str = Field(description="A concise summary of the discussion")
    sentiment: str = Field(description="The sentiment of the doctor (Positive, Neutral, Negative)")
    key_topics: str = Field(description="Comma-separated list of key topics discussed")
    outcome: Optional[str] = Field(None, description="The outcome or follow-up action")

def extract_interaction_sync(text: str) -> Optional[Dict[str, Any]]:
    """
    Uses Groq LLM to extract structured data from natural language interaction descriptions.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logger.error("GROQ_API_KEY not found in environment variables.")
        return None

    try:
        llm = ChatGroq(
            model_name="llama-3.3-70b-versatile",
            groq_api_key=api_key,
            temperature=0.1,
        )

        prompt = f"""
        Extract structured interaction data from the following text:
        "{text}"

        Return ONLY a JSON object with the following keys:
        - doctor_name
        - interaction_type (Strictly one of: Meeting, Call, Email)
        - summary
        - sentiment (Strictly one of: Positive, Neutral, Negative)
        - key_topics (string list)
        - outcome (optional)

        Example Output:
        {{
            "doctor_name": "Dr. Smith",
            "interaction_type": "Meeting",
            "summary": "Discussed clinical trials.",
            "sentiment": "Positive",
            "key_topics": "Trial A, Safety data",
            "outcome": "Schedule follow-up"
        }}
        """

        response = llm.invoke(prompt)
        
        # Robust JSON extraction
        content = response.content.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        
        data = json.loads(content)
        
        # Basic validation
        valid_types = ['Meeting', 'Call', 'Email']
        if data.get('interaction_type') not in valid_types:
            data['interaction_type'] = 'Meeting'
            
        valid_sentiments = ['Positive', 'Neutral', 'Negative']
        if data.get('sentiment') not in valid_sentiments:
            data['sentiment'] = 'Neutral'
            
        return data

    except Exception as e:
        logger.error(f"LLM Extraction failed: {str(e)}")
        return None

async def run_agent(text: str) -> Dict[str, Any]:
    """
    Main entry point for AI chat. Extracts data and saves to DB.
    """
    extracted_data = extract_interaction_sync(text)
    
    if not extracted_data:
        return {"response": "I couldn't extract the details. Could you please provide more information?", "success": False}

    # Save to Database
    db = SessionLocal()
    try:
        db_interaction = models.Interaction(
            doctor_name=extracted_data.get('doctor_name', 'Unknown HCP'),
            interaction_type=extracted_data.get('interaction_type', 'Meeting'),
            summary=extracted_data.get('summary', ''),
            sentiment=extracted_data.get('sentiment', 'Neutral'),
            key_topics=extracted_data.get('key_topics', ''),
            raw_text=text,
            outcome=extracted_data.get('outcome')
        )
        db.add(db_interaction)
        db.commit()
        db.refresh(db_interaction)
        
        return {
            "response": f"Successfully logged the interaction with {db_interaction.doctor_name}.",
            "data": extracted_data,
            "success": True
        }
    except Exception as e:
        logger.error(f"DB Save failed: {str(e)}")
        return {"response": f"Extracted data but failed to save to DB: {str(e)}", "success": False}
    finally:
        db.close()
