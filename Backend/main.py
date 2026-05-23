from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from uuid import uuid4

import models
import schemas

from database import engine, SessionLocal


# -----------------------------
# Create Tables
# -----------------------------
models.Base.metadata.create_all(bind=engine)


app = FastAPI()


# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Database Session
# -----------------------------
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# -----------------------------
# Home Route
# -----------------------------
@app.get("/")
def home():

    return {
        "message": "SQLite Notes API Running"
    }


# -----------------------------
# Get All Notes
# -----------------------------
@app.get("/notes", response_model=list[schemas.NoteResponse])
def get_notes():

    db: Session = SessionLocal()

    notes = db.query(models.Note).all()

    return notes


# -----------------------------
# Create Note
# -----------------------------
@app.post("/notes", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate):

    db: Session = SessionLocal()

    new_note = models.Note(

        id=str(uuid4()),

        title=note.title,

        content=note.content,

        category=note.category
    )

    db.add(new_note)

    db.commit()

    db.refresh(new_note)

    return new_note


# -----------------------------
# Delete Note
# -----------------------------
@app.delete("/notes/{note_id}")
def delete_note(note_id: str):

    db: Session = SessionLocal()

    note = db.query(models.Note).filter(
        models.Note.id == note_id
    ).first()


    if not note:

        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )


    db.delete(note)

    db.commit()

    return {
        "message": "Note deleted successfully"
    }


# -----------------------------
# Update Note
# -----------------------------
@app.put(
    "/notes/{note_id}",
    response_model=schemas.NoteResponse
)
def update_note(
    note_id: str,
    updated_note: schemas.NoteCreate
):

    db: Session = SessionLocal()

    note = db.query(models.Note).filter(
        models.Note.id == note_id
    ).first()


    if not note:

        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )


    note.title = updated_note.title

    note.content = updated_note.content

    note.category = updated_note.category


    db.commit()

    db.refresh(note)

    return note