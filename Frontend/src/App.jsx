import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotesAPI,
  createNoteAPI,
  deleteNoteAPI,
  updateNoteAPI,
} from "./features/notes/notesAPI";
import {
  addNote,
  setNotes,
  deleteNotes,
  updateNote,
} from "./features/notes/notesSlice";

function App() {
  const notes = useSelector((state) => state.notes.notes);
  const [count, setCount] = useState(0);

  // -----------------------------
  // Form State
  // -----------------------------
  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [category, setCategory] = useState("");

  const [editingId, setEditingId] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const loadNotes = async () => {
      const data = await fetchNotesAPI();

      dispatch(setNotes(data));
    };

    loadNotes();
  }, []);

  const handleDelete = async (id) => {
    await deleteNoteAPI(id);

    dispatch(deleteNotes(id));
  };

  const handleEdit = (note) => {
    setTitle(note.title);

    setContent(note.content);

    setCategory(note.category);

    setEditingId(note.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const noteData = {
      title,
      content,
      category,
    };

    // -----------------------------
    // UPDATE
    // -----------------------------
    if (editingId) {
      const updated = await updateNoteAPI(editingId, noteData);

      dispatch(updateNote(updated));

      setEditingId(null);
    }

    // -----------------------------
    // CREATE
    // -----------------------------
    else {
      const createdNote = await createNoteAPI(noteData);

      dispatch(addNote(createdNote));
    }

    // Clear Form
    setTitle("");
    setContent("");
    setCategory("");
  };

  return (
    <>
      <div>
        <h1>Notes App</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <br />
          <br />

          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <br />
          <br />

          <button type="submit">{editingId ? "Update Note" : "Add Note"}</button>
        </form>

        <h2>Total Notes: {notes.length}</h2>

        {notes.map((note) => (
          <div key={note.id}>
            <h3>{note?.title}</h3>
            <p>{note.content}</p>
            <small>{note.category}</small>
            <br />
            <button onClick={() => handleEdit(note)}>Edit</button><br />
            <button onClick={() => handleDelete(note.id)}>Delete</button>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
