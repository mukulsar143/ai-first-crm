# AI-First CRM: Demo & System Flow

This document provides a deep dive into how the AI Assistant works within the CRM and showcases sample interactions.

## 🧠 How the AI Works

The AI Assistant uses a high-performance LLM (**Llama 3.3 70B**) via the **Groq** API to transform unstructured natural language into structured CRM records.

### The Flow:
1. **User Input**: A user types a natural language description of an interaction in the AI Assistant side panel.
2. **Extraction Engine**: The backend (`agent.py`) sends this text to the LLM with a specialized prompt for JSON extraction.
3. **Structured Validation**: The system parses the JSON to extract:
   - **HCP Name**: Identifying the doctor mentioned.
   - **Interaction Type**: Categorizing as Meeting, Call, or Email.
   - **Sentiment**: Detecting the tone of the interaction (Positive/Neutral/Negative).
   - **Summary**: Generating a concise recap.
4. **Database Persistence**: Once validated, the record is automatically saved to the SQLite database.
5. **Real-time UI**: The frontend receives a success signal and automatically refreshes the **Interaction History** list.

## 📝 Sample Input/Output

### Input:
> "Met Dr. Sarah Jenkins today. We discussed the new Product X clinical results. She seemed impressed (positive) and asked to schedule a follow-up for next Tuesday."

### AI Extraction (Structured Result):
```json
{
  "doctor_name": "Dr. Sarah Jenkins",
  "interaction_type": "Meeting",
  "summary": "Discussed Product X clinical results.",
  "sentiment": "Positive",
  "key_topics": "Clinical trials, Product X",
  "outcome": "Schedule follow-up for next Tuesday"
}
```

### Result:
A new entry appears instantly in your **Interaction History** with all fields pre-filled.

## 📺 System Architecture
- **Frontend**: React, Tailwind CSS, Redux Toolkit.
- **Backend**: FastAPI (Python), SQLAlchemy ORM.
- **AI**: LangChain + Groq (Llama 3.3).
- **Database**: SQLite (local dev).
