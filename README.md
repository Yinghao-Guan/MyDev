# Peter Guan Digital Cortex

Interactive portfolio with a terminal-style interface, project demos, and AI-backed backend endpoints.

## Current Stack

### Frontend (`frontend/`)
- Next.js `16.0.8` (App Router, React `19.2.1`)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- React Three Fiber / Drei / Three.js
- Vercel Analytics

### Backend (`backend/`)
- FastAPI + Uvicorn
- LangChain Google GenAI (`ChatGoogleGenerativeAI`)
- Google Gemini APIs (`gemini-2.5-flash`)
- SlowAPI rate limiting
- HTTPX for external API calls

## What The App Does

- Home page terminal UX (desktop) and mobile messenger UI
- Built-in local shell-like commands: `help`, `whoami`, `ls`, `cd`, `clear`, `cmatrix`, `cowsay`
- LLM chat streaming from backend (`/api/chat`)
- Veru citation-audit demo using NDJSON streaming (`/api/audit`)
- Realibuddy claim-check demo (`/api/realibuddy/audit`)
- Backend wake-up ping on load (`/api/health`)

## API Endpoints

- `GET /api/health`: health/wake check
- `POST /api/chat`: streaming terminal chat response (`text/event-stream`)
- `POST /api/audit`: citation extraction + verification stream (`application/x-ndjson`), rate-limited to `10/minute`
- `POST /api/realibuddy/audit`: fact-check response with optional `source_filter`

## Local Development

### Prerequisites
- Python 3.10+
- Node.js 20+ (recommended for Next.js 16)
- npm
- Gemini API key(s)

### 1) Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
# Used by /api/chat and Realibuddy service
DEV_API_KEY=your_gemini_api_key

# Used by citation extraction/auditor/google search modules
GEMINI_API_KEY=your_gemini_api_key

# Optional: only used in experimental perplexity service file
PERPLEXITY_API_KEY=

# Optional runtime port (default 8000)
PORT=8000
```

Run backend:

```bash
uvicorn app.main:app --reload --port 8000
```

### 2) Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run frontend:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

In `frontend/`:
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

In `backend/`:
- `uvicorn app.main:app --reload --port 8000`

## Project Layout

```text
.
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI app and routes
│   │   ├── data.py                # Portfolio context used by chat system prompt
│   │   └── services/              # Veru/Realibuddy/search/auditor modules
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/                   # Next.js routes: home, about, projects
    │   ├── components/            # UI/features/layout components
    │   └── hooks/                 # Terminal state/command logic
    ├── public/
    └── package.json
```

## Notes

- `backend/app/services/perplexity.py` exists but is not wired into active API routes.
- CORS in backend is currently restricted to localhost and specific production domains.

## License

Private portfolio project.

