# Peter Guan's Digital Cortex (.dev)

> A high-performance, terminal-styled portfolio for showcasing hardcore engineering & quantitative research projects.
> Built with Next.js 15, FastAPI, and Local LLMs.

## 🚀 Tech Stack

### Frontend (The Face)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Visuals**: Three.js / React Three Fiber (R3F) - Interactive Particle System
- **Animation**: Framer Motion

### Backend (The Brain)
- **Framework**: FastAPI (Python)
- **AI Engine**: LangChain + Ollama (Running Llama 3.1 / Qwen locally) / Gemini API (Planned)
- **Architecture**: REST API with Streaming Response (Server-Sent Events)

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com/) (for local AI inference)

### 1. Backend Setup (Python)

Navigate to the backend directory and set up the virtual environment.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # MacOS/Linux
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt
```

**Configuration (.env)**: Create a `.env` file in `backend/`:

```
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

**Run Server:**

```bash
# Runs on http://localhost:8000
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup (Next.js)

Open a new terminal tab.

```bash
cd frontend

# Install dependencies
npm install

# Run Development Server
npm run dev
```

Visit `http://localhost:3000` to access the neural link.

## AI Context Injection (RAG)

The system uses a lightweight Context Injection mechanism to ground the AI in reality.

- **Data Source**: `backend/app/data.py`
- **Mechanism**: System Prompt Injection via LangChain
- **Capabilities**: The AI is aware of Peter's resume, tech stack, and project details (Veru, MyMD, etc.).

## Project Structure

```
.
├── backend/            # FastAPI Python Server
│   ├── app/
│   │   ├── main.py     # API Entry & Streaming Logic
│   │   └── data.py     # Resume Data / Knowledge Base
│   └── requirements.txt
│
└── frontend/           # Next.js Application
    ├── src/
    │   ├── app/        # App Router Pages
    │   ├── components/
    │   │   ├── features/ # Terminal & Interactive Components
    │   │   └── layout/   # 3D Backgrounds & Navbar
    └── public/
```

## License

Private Portfolio Project.


