# Burt's Bookshelf

![Burt's Bookshelf UI](frontend/public/screenshots.png)

## Overview
A Vite-powered React frontend backed by a Django REST API for browsing and managing a curated bookshelf experience.

## Tech Stack
- Frontend: React 19 + Vite, React Router
- Backend: Django 5 + Django REST Framework
- Tooling: ESLint 9

## Quick Start
### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend (Django)
1. `cd backend`
2. Create and activate a virtualenv (e.g., `python -m venv .venv` then `.venv\Scripts\activate` on Windows).
3. `pip install -r requirements.txt`
4. Apply migrations: `python manage.py migrate`
5. (Optional) Seed sample books: `python manage.py seed_books`
6. Run the API: `python manage.py runserver`

## Project Structure
- frontend/ — React app (Vite)
- backend/ — Django REST backend
- fastapi_app/ — FastAPI sandbox (optional)

## Notes
- The README expects a screenshot at `frontend/public/screenshots.png` (the UI image shared in this request). Place the image there so it renders above.
