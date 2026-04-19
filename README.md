# 🏥 AI-First CRM for Healthcare

A professional, enterprise-grade CRM interface designed for Pharmaceutical and MedTech sales teams. This platform features a dense, high-contrast UI and a powerful **AI-First** assistant that automates interaction logging using natural language.

## ✨ Key Features

- **🚀 AI Interaction Logging**: Transform natural language sentences into structured CRM records.
- **🎭 Sentiment Detection**: Automatic detection of HCP sentiment (Positive/Neutral/Negative) from chat input.
- **📊 70/30 Analytical Layout**: Dense, SaaS-inspired interface optimized for high information display.
- **📜 Live Interaction History**: Real-time refreshing list of recent doctor interactions.
- **⚡ AI Suggestions**: Automated recommendations for next steps based on meeting notes.

## 🛠 Tech Stack

- **Frontend**: React 18, Tailwind CSS v3, Redux Toolkit, Lucide Icons.
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy.
- **AI Engine**: Groq LLM (Llama 3.3 70B), LangChain.
- **Database**: SQLite.

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- A [Groq API Key](https://console.groq.com/)

### 2. Backend Setup (Render Deployment)
- **Runtime**: Python 3.10.13 (via `backend/runtime.txt`)
- **Build Command**: `cd backend && pip install -r requirements.txt`
- **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port 10000`

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Ensure VITE_API_URL points to your backend
npm run dev
```

## 🧪 Example AI Usage

Try typing these into the **AI Assistant** panel:
- *"Talked to Dr. Smith on the phone about Product Y. He's neutral and wants more pricing info."*
- *"Had a meeting with Dr. Anjali Sharma regarding Q3 trials. Very positive feedback!"*

## 📄 License
MIT
