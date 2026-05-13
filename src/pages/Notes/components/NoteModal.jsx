import React, { useState, useEffect } from "react";
import { RiCloseLine, RiSaveLine } from "react-icons/ri";

const COLORS = ["brand", "accent", "purple", "yellow", "pink", "orange"];
const TAGS   = ["DSA", "React", "JavaScript", "System Design", "DBMS", "OS", "Networking", "HR", "General"];

const DOT_MAP = {
  brand:  "bg-brand-400",
  accent: "bg-accent-400",
  purple: "bg-purple-400",
  yellow: "bg-yellow-400",
  pink:   "bg-pink-400",
  orange: "bg-orange-400",
};

const RING_MAP = {
  brand:  "ring-brand-400",
  accent: "ring-accent-400",
  purple: "ring-purple-400",
  yellow: "ring-yellow-400",
  pink:   "ring-pink-400",
  orange: "ring-orange-400",
};

function NoteModal(props) {
  const note     = props.note;
  const onSave   = props.onSave;
  const onClose  = props.onClose;

  const [title,   setTitle]   = useState("");
  const [content, setContent] = useState("");
  const [tag,     setTag]     = useState("General");
  const [color,   setColor]   = useState("brand");
  const [error,   setError]   = useState("");

  const isEdit = note !== null && note !== undefined;

  useEffect(function() {
    if (isEdit && note) {
      setTitle(note.title   || "");
      setContent(note.content || "");
      setTag(note.tag       || "General");
      setColor(note.color   || "brand");
    }
  }, [note, isEdit]);

  function handleTitle(e)   { setTitle(e.target.value);   }
  function handleContent(e) { setContent(e.target.value); }

  function handleSave() {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim()) {
      setError("Content is required");
      return;
    }
    setError("");
    onSave({ title: title.trim(), content: content.trim(), tag, color });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative card p-6 w-full max-w-lg animate-fade-in">

        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-bold text-white">
            {isEdit ? "Edit Note" : "Create Note"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <RiCloseLine className="text-lg" />
          </button>
        </div>

        <div className="flex flex-col gap-4">

          <div>
            <label className="label">Title</label>
            <input
              type="text"
              value={title}
              onChange={handleTitle}
              placeholder="Note title..."
              className="input"
            />
          </div>

          <div>
            <label className="label">Tag</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(function(t) {
                const isActive  = tag === t;
                const btnClass  = isActive
                  ? "px-3 py-1 rounded-lg text-xs font-semibold border bg-brand-500 text-white border-brand-500 transition-all"
                  : "px-3 py-1 rounded-lg text-xs font-semibold border bg-white/5 text-slate-400 border-white/10 hover:border-brand-500/30 hover:text-white transition-all";

                function handleTag() { setTag(t); }

                return (
                  <button key={t} onClick={handleTag} className={btnClass}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="label">Color</label>
            <div className="flex gap-2">
              {COLORS.map(function(c) {
                const isActive  = color === c;
                const dotClass  = "w-6 h-6 rounded-full cursor-pointer transition-all " + DOT_MAP[c] + (isActive ? " ring-2 ring-offset-2 ring-offset-surface-card scale-110 " + RING_MAP[c] : "");

                function handleColor() { setColor(c); }

                return (
                  <div
                    key={c}
                    onClick={handleColor}
                    className={dotClass}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <label className="label">Content</label>
            <textarea
              value={content}
              onChange={handleContent}
              placeholder="Write your note here..."
              rows={5}
              className="input resize-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary flex-1">
              <RiSaveLine />
              {isEdit ? "Save Changes" : "Create Note"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default NoteModal;