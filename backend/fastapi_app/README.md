# FastAPI backend for Burt's Bookshelf

This service exposes the same book data from the existing SQLite database (`backend/db.sqlite3`) via FastAPI.

## Setup

1) Activate your virtualenv (same as Django):
```powershell
& .\.venv\Scripts\Activate.ps1
```

2) Install FastAPI dependencies:
```powershell
pip install -r backend/fastapi_app/requirements.txt
```

## Run the API (port 8000)
From the repo root:
```powershell
uvicorn backend.fastapi_app.main:app --reload --host 0.0.0.0 --port 8000
```

## Test endpoints
```powershell
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/api/books/
curl http://127.0.0.1:8000/api/featured/
```

## Frontend config
Set `frontend/.env`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```
Then restart `npm run dev`.
