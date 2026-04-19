import os
import json
import logging
import http.client
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from .database import SessionLocal
from . import models

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InteractionExtraction(BaseModel):
    doctor_name: str
    interaction_type: str
    summary: str
    sentiment: str
    key_topics: str
    outcome: Optional[str] = None

def extract_interaction_sync(text: str) -> Optional[Dict[str, Any]]:
    """
    Uses raw Groq API call to extract structured data from natural language.
    Eliminates LangChain dependency for minimal Render footprint.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logger.error("GROQ_API_KEY not found in environment variables.")
        return None

    try:
        conn = http.client.HTTPSConnection("api.groq.com")
        
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
        """

        payload = json.dumps({
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1,
            "response_format": {"type": "json_object"}
        })

        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

        conn.request("POST", "/openai/v1/chat/completions", payload, headers)
        res = conn.getresponse()
        data = res.read()
        
        result_json = json.loads(data.decode("utf-8"))
        content = result_json['choices'][0]['message']['content']
        
        extracted_data = json.loads(content)
        
        # Basic validation
        valid_types = ['Meeting', 'Call', 'Email']
        if extracted_data.get('interaction_type') not in valid_types:
            extracted_data['interaction_type'] = 'Meeting'
            
        valid_sentiments = ['Positive', 'Neutral', 'Negative']
        if extracted_data.get('sentiment') not in valid_sentiments:
            extracted_data['sentiment'] = 'Neutral'
            
        return extracted_data

    except Exception as e:
        logger.error(f"Raw LLM Extraction failed: {str(e)}")
        return None

async def run_agent(text: str) -> Dict[str, Any]:
    """
    Main entry point for AI chat. Extracts data and saves to DB.
    """
    extracted_data = extract_interaction_sync(text)
    
    if not extracted_data:
        return {"response": "I couldn't extract the details. Could you please provide more information?", "success": False}

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
