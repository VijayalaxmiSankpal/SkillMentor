import React, { useEffect, useState } from "react";
import { RiAddLine, RiSearchLine, RiFileTextLine } from "react-icons/ri";
import NoteCard from "./components/NoteCard";
import NoteModal from "./components/NoteModal";
import DeleteModal from "./components/DeleteModal";
import toast from "react-hot-toast";
import notesService from "../../services/notesService";

const TAG_TO_CATEGORY = {
  DSA: "dsa",
  React: "frontend",
  JavaScript: "frontend",
  "System Design": "system-design",
  DBMS: "dbms",
  OS: "os",
  Networking: "cn",
  HR: "hr",
  General: "other",
};

const CATEGORY_TO_TAG = {
  dsa: "DSA",
  frontend: "React",
  backend: "Backend",
  "system-design": "System Design",
  dbms: "DBMS",
  os: "OS",
  cn: "Networking",
  hr: "HR",
  other: "General",
};

const COLORS = ["brand", "accent", "purple", "yellow", "pink", "orange"];

const formatNoteFromBackend = (note, index) => ({
  id: note._id,
  title: note.title,
  content: note.content,
  tag: CATEGORY_TO_TAG[note.category] || "General",
  color: COLORS[index % COLORS.length],
  date: new Date(note.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
});

const formatNoteForBackend = (data) => ({
  title: data.title,
  content: data.content,
  category: TAG_TO_CATEGORY[data.tag] || "other",
  tags: [data.tag.toLowerCase()],
});

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [deleteNote, setDeleteNote] = useState(null);
  const [activeTag, setActiveTag] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await notesService.getNotes();
      const items = response.data?.items || [];
      setNotes(items.map(formatNoteFromBackend));
    } catch (error) {
      console.error("Failed to load notes:", error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const allTags = ["All"].concat(
    notes
      .map((n) => n.tag)
      .filter((tag, index, arr) => arr.indexOf(tag) === index)
  );

  const filtered = notes.filter((note) => {
    const matchSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());

    const matchTag = activeTag === "All" || note.tag === activeTag;

    return matchSearch && matchTag;
  });

  function openCreate() {
    setEditNote(null);
    setModalOpen(true);
  }

  function openEdit(note) {
    setEditNote(note);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditNote(null);
  }

  async function handleSave(data) {
    try {
      const payload = formatNoteForBackend(data);

      if (editNote) {
        await notesService.updateNote(editNote.id, payload);
        toast.success("Note updated!");
      } else {
        await notesService.createNote(payload);
        toast.success("Note created!");
      }

      closeModal();
      await loadNotes();
    } catch (error) {
      console.error("Save note failed:", error);
      toast.error(error?.response?.data?.message || "Failed to save note");
    }
  }

  function openDelete(note) {
    setDeleteNote(note);
  }

  function closeDelete() {
    setDeleteNote(null);
  }

  async function handleDelete() {
    if (!deleteNote) return;

    try {
      await notesService.deleteNote(deleteNote.id);
      toast.success("Note deleted!");
      closeDelete();
      await loadNotes();
    } catch (error) {
      console.error("Delete note failed:", error);
      toast.error("Failed to delete note");
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-1">
            My Notes
          </h2>
          <p className="text-slate-400 text-sm">{notes.length} notes saved</p>
        </div>

        <button onClick={openCreate} className="btn-primary w-fit">
          <RiAddLine />
          New Note
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-surface-card border border-surface-border rounded-xl px-3 py-2 flex-1">
          <RiSearchLine className="text-slate-500 flex-shrink-0" />

          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isActive = activeTag === tag;

            const btnClass = isActive
              ? "px-3 py-1.5 rounded-xl text-xs font-semibold border bg-brand-500 text-white border-brand-500 transition-all"
              : "px-3 py-1.5 rounded-xl text-xs font-semibold border bg-white/5 text-slate-400 border-white/10 hover:border-brand-500/30 hover:text-white transition-all";

            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={btnClass}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="card p-16 flex flex-col items-center gap-4 text-center">
          <p className="text-slate-400 text-sm">Loading notes...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center">
            <RiFileTextLine className="text-brand-400 text-2xl" />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-white mb-1">
              No notes found
            </h3>

            <p className="text-slate-400 text-sm">
              {search
                ? "Try a different search term."
                : "Create your first note to get started."}
            </p>
          </div>

          {!search && (
            <button onClick={openCreate} className="btn-primary">
              <RiAddLine />
              Create Note
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <NoteModal note={editNote} onSave={handleSave} onClose={closeModal} />
      )}

      {deleteNote && (
        <DeleteModal
          note={deleteNote}
          onConfirm={handleDelete}
          onClose={closeDelete}
        />
      )}
    </div>
  );
}

export default NotesPage;