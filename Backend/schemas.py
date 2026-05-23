from pydantic import BaseModel


class NoteCreate(BaseModel):

    title: str

    content: str

    category: str


class NoteResponse(NoteCreate):

    id: str

    class Config:
        from_attributes = True