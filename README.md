# Burt's Bookshelf

![Burt's Bookshelf UI](frontend/public/screenshots.png)

## What This Is
A Vite-powered React experience paired with a Django REST API that serves book data. The frontend blends API-powered content with seeded/demo items so the UI stays rich even if the backend is empty or offline.

## How It Was Built
- **Frontend (Vite + React 19):** Single-page app with `react-router-dom` 7 for navigation. Layout, hero, category sections, and cart/wishlist live in [frontend/src/App.jsx](frontend/src/App.jsx). Reusable book tiles are in [frontend/src/components/BookCard.jsx](frontend/src/components/BookCard.jsx), keeping UI logic (ratings, wishlist toggle, quantity controls) isolated from page state.
- **Data flow:** On load, the app calls `GET /api/books/` (configurable via `VITE_API_BASE_URL`). Responses hydrate the catalog; if the API is empty or unavailable, the UI falls back to curated sample data and fills missing covers/prices to keep the layout intact. Wishlist and cart state are client-side (`useState`), with derived totals and badge counts in the header. A basic search box is stubbed; you can wire it to the same endpoint with server-side filtering.
- **Backend (Django 5 + DRF):** A minimal `Book` model ([backend/books/models.py](backend/books/models.py)) exposed through a DRF `ModelViewSet` ([backend/books/views.py](backend/books/views.py)). Default router wiring sits in [backend/books/urls.py](backend/books/urls.py). CORS is open to the Vite dev server, and DRF Spectacular is enabled for schema generation.
- **Styling/UX:** Custom CSS in `App.css` drives the bookshelf aesthetic (hero banner, cards, badges, counters). Buttons and wishlist hearts are keyboard-accessible; counters announce quantity via `aria-live`.
- **Developer ergonomics:** ESLint 9 baseline, Vite dev server with HMR, and DRF schema generation to keep frontend/back-end contracts visible.

## Quick Start
### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Optional: set `VITE_API_BASE_URL` in a `.env` file (e.g., `http://localhost:8000`).

### Backend (Django)
1. `cd backend`
2. Create and activate a virtualenv (e.g., `python -m venv .venv` then `.venv\Scripts\activate`).
3. `pip install -r requirements.txt`
4. `python manage.py migrate`
5. (Optional) seed sample books: `python manage.py seed_books`
6. Run the API: `python manage.py runserver`

## API Surface
- `GET /api/books/` — list with search/order filters (title, author, category).
- `POST /api/books/` — create.
- `GET /api/books/{id}/` — retrieve.
- `PATCH /api/books/{id}/` — update.
- `DELETE /api/books/{id}/` — delete.

## Design Notes
- Frontend gracefully degrades: if the API is down, curated seed data keeps the catalog visible and prices/badges consistent.
- Category sections are client-side compositions from the same book pool; carts/wishlists are stored locally for speed and simplicity.
- Covers default to a local pool to avoid broken images; DRF data can override with real cover URLs.
- Schema via DRF Spectacular makes it straightforward to expand endpoints (e.g., orders, users, reviews) without breaking clients.

## Project Layout
- frontend/ — Vite + React SPA
- backend/ — Django REST API (books app, DRF, Spectacular)
- fastapi_app/ — FastAPI sandbox (optional experiments)

## Image
The hero/screenshot above expects a file at `frontend/public/screenshots.png`. Drop the provided PNG there to render it locally and on GitHub.
