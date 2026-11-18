
"use client";

import { useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch notes from NeonDB
  async function fetchNotes() {
    try {
      const response = await fetch("/api/notes");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load notes");
      }

      setNotes(data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Could not load notes!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add a new note
  async function addNote() {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both fields!");
      return;
    }

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save note");
      }

      setTitle("");
      setContent("");

      await fetchNotes();

      alert("Note saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Could not save note!");
    }
  }

  // Delete a note
  async function deleteNote(id: number) {
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      await fetchNotes();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Could not delete note!");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-3xl">

        <h1 className="mb-2 text-4xl font-bold text-slate-800">
          My Daily Notes
        </h1>

        <p className="mb-8 text-slate-500">
          Your personal space to write and organize notes.
        </p>

        {/* Create Note */}
        <div className="rounded-xl bg-white p-6 shadow-md">

          <h2 className="mb-4 text-xl font-semibold">
            Create a New Note
          </h2>

          <input
            type="text"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <textarea
            placeholder="Write your notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="mb-4 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={addNote}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Note
          </button>

        </div>

        {/* Display Notes */}
        <div className="mt-10">

          <h2 className="mb-4 text-2xl font-bold text-slate-800">
            My Notes ({notes.length})
          </h2>

          {loading ? (
            <p className="text-slate-500">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="rounded-lg bg-white p-6 text-center text-slate-400">
              No notes yet. Add your first note!
            </p>
          ) : (
            <div className="space-y-4">

              {notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >

                  <h3 className="mb-2 text-lg font-bold text-slate-800">
                    {note.title}
                  </h3>

                  <p className="whitespace-pre-wrap text-slate-600">
                    {note.content}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(note.created_at).toLocaleString()}
                  </p>

                  <button
                    onClick={() => deleteNote(note.id)}
                    className="mt-4 text-sm font-medium text-red-500 hover:text-red-700"
                  >
                    Delete Note
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}
