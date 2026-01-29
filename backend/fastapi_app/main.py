from __future__ import annotations

from pathlib import Path
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, DateTime, Integer, Numeric, String, Text, create_engine, func
from sqlalchemy.orm import Session, declarative_base, sessionmaker

# Use the existing SQLite database in ../db.sqlite3
BASE_DIR = Path(__file__).resolve().parent
DATABASE_URL = f"sqlite:///{(BASE_DIR / '..' / 'db.sqlite3').resolve()}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Book(Base):
    __tablename__ = "books_book"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), default="")
    description = Column(Text, default="")
    category = Column(String(100), default="")
    price = Column(Numeric(8, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class BookSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    author: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


app = FastAPI(title="Bookstore FastAPI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api/books/", response_model=List[BookSchema])
def list_books(db: Session = Depends(get_db)):
    return db.query(Book).order_by(Book.title).all()


@app.get("/api/books/{book_id}", response_model=BookSchema)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@app.get("/api/featured/", response_model=List[BookSchema])
def featured_books(db: Session = Depends(get_db)):
    # Use newest books as "featured"; adjust ordering as desired
    return db.query(Book).order_by(Book.created_at.desc()).limit(12).all()


@app.get("/health")
def health():
    return {"status": "ok"}
