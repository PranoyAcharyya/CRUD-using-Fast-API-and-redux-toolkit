import { useEffect, useState } from "react";

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
  deleteNote,
  updateNote,
} from "./features/notes/notesSlice";

function App() {

  const notes = useSelector(
    (state) => state.notes.notes
  );

  const dispatch = useDispatch();


  // -----------------------------
  // Form State
  // -----------------------------
  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [category, setCategory] = useState("");

  const [editingId, setEditingId] = useState(null);


  // -----------------------------
  // Load Notes
  // -----------------------------
  useEffect(() => {

    const loadNotes = async () => {

      const data = await fetchNotesAPI();

      dispatch(setNotes(data));
    };

    loadNotes();

  }, []);


  // -----------------------------
  // Delete
  // -----------------------------
  const handleDelete = async (id) => {

    await deleteNoteAPI(id);

    dispatch(deleteNote(id));
  };


  // -----------------------------
  // Edit
  // -----------------------------
  const handleEdit = (note) => {

    setTitle(note.title);

    setContent(note.content);

    setCategory(note.category);

    setEditingId(note.id);
  };


  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = async (e) => {

    e.preventDefault();

    const noteData = {
      title,
      content,
      category,
    };


    // UPDATE
    if (editingId) {

      const updated = await updateNoteAPI(
        editingId,
        noteData
      );

      dispatch(updateNote(updated));

      setEditingId(null);
    }


    // CREATE
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

    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">

      <div className="max-w-6xl mx-auto">


        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl font-bold tracking-tight">
            Notes App
          </h1>

          <p className="text-zinc-400 mt-2">
            Redux Toolkit + FastAPI + SQLite
          </p>

        </div>


        {/* FORM */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600"
            />


            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600 resize-none"
            />


            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600"
            />


            <button
              type="submit"
              className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              {editingId
                ? "Update Note"
                : "Add Note"}
            </button>

          </form>

        </div>


        {/* NOTES HEADER */}
        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-semibold">
            Your Notes
          </h2>

          <span className="text-zinc-400">
            {notes.length} Notes
          </span>

        </div>


        {/* NOTES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {
            notes.map((note) => (

              <div
                key={note.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between"
              >

                <div>

                  <div className="flex items-center justify-between mb-4">

                    <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full text-zinc-300">
                      {note.category}
                    </span>

                  </div>


                  <h3 className="text-xl font-semibold mb-3">
                    {note.title}
                  </h3>


                  <p className="text-zinc-400 leading-relaxed">
                    {note.content}
                  </p>

                </div>


                {/* ACTIONS */}
                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() => handleEdit(note)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 transition px-4 py-2 rounded-xl"
                  >
                    Edit
                  </button>


                  <button
                    onClick={() => handleDelete(note.id)}
                    className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition px-4 py-2 rounded-xl"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))
          }

        </div>

      </div>

    </div>
  );
}

export default App;