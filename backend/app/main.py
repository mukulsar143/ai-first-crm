from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

load_dotenv()
from . import models, schemas, database
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-First CRM HCP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI-First CRM HCP API"}

@app.post("/interactions", response_model=schemas.APIResponse)
def create_interaction(interaction: schemas.InteractionCreate, db: Session = Depends(get_db)):
    db_interaction = models.Interaction(**interaction.dict())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return {"success": True, "data": schemas.InteractionResponse.from_orm(db_interaction)}

@app.get("/interactions", response_model=schemas.APIResponse)
def get_interactions(db: Session = Depends(get_db)):
    interactions = db.query(models.Interaction).all()
    return {"success": True, "data": [schemas.InteractionResponse.from_orm(i) for i in interactions]}

@app.put("/interactions/{interaction_id}", response_model=schemas.APIResponse)
def update_interaction(interaction_id: int, interaction: schemas.InteractionUpdate, db: Session = Depends(get_db)):
    db_interaction = db.query(models.Interaction).filter(models.Interaction.id == interaction_id).first()
    if not db_interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    update_data = interaction.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_interaction, key, value)
    
    db.commit()
    db.refresh(db_interaction)
    return {"success": True, "data": schemas.InteractionResponse.from_orm(db_interaction)}

@app.post("/ai/chat", response_model=schemas.APIResponse)
async def ai_chat(request: schemas.ChatRequest):
    from .agent import run_agent
    try:
        result = await run_agent(request.message)
        if result.get("success"):
            return {"success": True, "data": result}
        else:
            return {"success": False, "message": result.get("response")}
    except Exception as e:
        return {"success": False, "message": str(e)}
