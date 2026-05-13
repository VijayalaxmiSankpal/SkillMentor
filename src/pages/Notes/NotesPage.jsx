import React, { useState } from "react";
import { RiAddLine, RiSearchLine, RiFileTextLine } from "react-icons/ri";
import NoteCard    from "./components/NoteCard";
import NoteModal   from "./components/NoteModal";
import DeleteModal from "./components/DeleteModal";
import toast       from "react-hot-toast";

const INITIAL_NOTES = [
  {
    id:      1,
    title:   "React useEffect Deep Dive",
    content: "useEffect runs after every render by default. To run it only once, pass an empty array as the second argument. To clean up, return a function from the effect. Common use cases include data fetching, subscriptions, and manually changing the DOM.",
    tag:     "React",
    color:   "brand",
    date:    "May 10, 2026",
  },
  {
    id:      2,
    title:   "Binary Search Template",
    content: "Binary search works on sorted arrays. Template: lo=0, hi=n-1. While lo<=hi, mid = lo + (hi-lo)/2. If arr[mid]==target return mid. If arr[mid] < target, lo=mid+1. Else hi=mid-1. Time: O(log n), Space: O(1).",
    tag:     "DSA",
    color:   "accent",
    date:    "May 9, 2026",
  },
  {
    id:      3,
    title:   "SQL Joins Summary",
    content: "INNER JOIN returns matching rows from both tables. LEFT JOIN returns all rows from left table. RIGHT JOIN returns all rows from right table. FULL OUTER JOIN returns all rows when there is a match in either table.",
    tag:     "DBMS",
    color:   "purple",
    date:    "May 8, 2026",
  },
  {
    id:      4,
    title:   "JavaScript Promises",
    content: "A Promise represents an eventual completion or failure of an async operation. States: pending, fulfilled, rejected. Use .then() for success and .catch() for errors. async/await is syntactic sugar over promises making async code look synchronous.",
    tag:     "JavaScript",
    color:   "yellow",
    date:    "May 7, 2026",
  },
  {
    id:      5,
    title:   "OS Process vs Thread",
    content: "A process is an independent program in execution with its own memory space. A thread is a lightweight unit of execution within a process that shares memory. Threads are faster to create and communicate but harder to synchronize.",
    tag:     "OS",
    color:   "pink",
    date:    "May 6, 2026",
  },
  {
    id:      6,
    title:   "HTTP Status Codes",
    content: "2xx Success: 200 OK, 201 Created, 204 No Content. 3xx Redirect: 301 Moved Permanently, 304 Not Modified. 4xx Client Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found. 5xx Server Error: 500 Internal Server Error.",
    tag:     "Networking",
    color:   "orange",
    date:    "May 5, 2026",
  },
];

let nextId = 7;

function NotesPage() {
  const [notes,       setNotes]       = useState(INITIAL_NOTES);
  const [search,      setSearch]      = useState("");
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editNote,    setEditNote]    = useState(null);
  const [deleteNote,  setDeleteNote]  = useState(null);
  const [activeTag,   setActiveTag]   = useState("All");

  const ALL_TAGS = ["All"].concat(
    INITIAL_NOTES.map(function(n) { return n.tag; })
    .filter(function(t, i, arr) { return arr.indexOf(t) === i; })
  );

  const filtered = notes.filter(function(note) {
    const matchSearch = note.title.toLowerCase().indexOf(search.toLowerCase()) !== -1
      || note.content.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    const matchTag = activeTag === "All" || note.tag === activeTag;
    return matchSearch && matchTag;
  });

  function handleSearch(e) { setSearch(e.target.value); }

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

  function handleSave(data) {
    if (editNote) {
      setNotes(function(prev) {
        return prev.map(function(n) {
          if (n.id === editNote.id) {
            return Object.assign({}, n, data);
          }
          return n;
        });
      });
      toast.success("Note updated!");
    } else {
      const newNote = Object.assign({}, data, {
        id:   nextId,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      });
      nextId = nextId + 1;
      setNotes(function(prev) { return [newNote].concat(prev); });
      toast.success("Note created!");
    }
    closeModal();
  }

  function openDelete(note) { setDeleteNote(note); }
  function closeDelete()    { setDeleteNote(null); }

  function handleDelete() {
    if (!deleteNote) return;
    setNotes(function(prev) {
      return prev.filter(function(n) { return n.id !== deleteNote.id; });
    });
    toast.success("Note deleted!");
    closeDelete();
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-1">
            My Notes
          </h2>
          <p className="text-slate-400 text-sm">
            {notes.length} notes saved
          </p>
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
            onChange={handleSearch}
            className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map(function(tag) {
            const isActive = activeTag === tag;
            const btnClass = isActive
              ? "px-3 py-1.5 rounded-xl text-xs font-semibold border bg-brand-500 text-white border-brand-500 transition-all"
              : "px-3 py-1.5 rounded-xl text-xs font-semibold border bg-white/5 text-slate-400 border-white/10 hover:border-brand-500/30 hover:text-white transition-all";

            function handleTag() { setActiveTag(tag); }

            return (
              <button key={tag} onClick={handleTag} className={btnClass}>
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center">
            <RiFileTextLine className="text-brand-400 text-2xl" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-1">
              No notes found
            </h3>
            <p className="text-slate-400 text-sm">
              {search ? "Try a different search term." : "Create your first note to get started."}
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
          {filtered.map(function(note) {
            return (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            );
          })}
        </div>
      )}

      {modalOpen && (
        <NoteModal
          note={editNote}
          onSave={handleSave}
          onClose={closeModal}
        />
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