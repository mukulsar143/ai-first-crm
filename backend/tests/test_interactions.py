import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

# Mock database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_create_interaction():
    response = client.post(
        "/interactions",
        json={
            "doctor_name": "Dr. House",
            "interaction_type": "Phone Call",
            "summary": "Discussed lupus (it was not lupus).",
            "sentiment": "Neutral"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["doctor_name"] == "Dr. House"

def test_get_interactions():
    client.post("/interactions", json={"doctor_name": "Dr. Smith", "interaction_type": "Meeting", "summary": "Test"})
    response = client.get("/interactions")
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) >= 1
