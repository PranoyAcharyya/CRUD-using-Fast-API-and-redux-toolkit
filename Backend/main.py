from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4


app = FastAPI()


# -----------------------------
# Temporary Database
# -----------------------------
notes = []


# -----------------------------
# Note Schema
# -----------------------------
class Note(BaseModel):
    title: str
    content: str
    category: str


# -----------------------------
# Home Route
# -----------------------------
@app.get("/")
def home():
    return {"message": "Notes API running"}


# -----------------------------
# Get All Notes
# -----------------------------
@app.get("/notes")
def get_notes():
    return notes

# -----------------------------
# Get single Note
# -----------------------------

@app.get("/notes/{note_id}")
def get_note(note_id: str):

    for note in notes:
        if note["id"] == note_id:
            return note

    raise HTTPException(status_code=404, detail="Note not found")

# -----------------------------
# Update single Note
# -----------------------------


@app.put("/notes/{note_id}")
def update_note(note_id: str, updated_note: Note):

    for note in notes:

        if note["id"] == note_id:

            note["title"] = updated_note.title
            note["content"] = updated_note.content
            note["category"] = updated_note.category

            return {
                "message": "Note updated successfully",
                "data": note
            }

    raise HTTPException(status_code=404, detail="Note not found")

# -----------------------------
# Delete Note
# -----------------------------


@app.delete("/notes/{note_id}")
def delete_note(note_id: str):

    for index, note in enumerate(notes):

        if note["id"] == note_id:

            deleted_note = notes.pop(index)

            return {
                "message": "Note deleted successfully",
                "data": deleted_note
            }

    raise HTTPException(status_code=404, detail="Note not found")


# -----------------------------
# Create Note
# -----------------------------

@app.post("/notes")
def create_note(note: Note):

    new_note = {
        "id": str(uuid4()),
        "title": note.title,
        "content": note.content,
        "category": note.category
    }

    notes.append(new_note)

    return {
        "message": "Note created successfully",
        "data": new_note
    }