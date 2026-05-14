import React from "react";
import { RiEditLine, RiDeleteBinLine, RiTimeLine } from "react-icons/ri";

const COLOR_MAP = {
  brand:  { bg: "bg-brand-500/10",  border: "border-brand-500/20",  dot: "bg-brand-400"  },
  accent: { bg: "bg-accent-500/10", border: "border-accent-500/20", dot: "bg-accent-400" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", dot: "bg-purple-400" },
  yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", dot: "bg-yellow-400" },
  pink:   { bg: "bg-pink-500/10",   border: "border-pink-500/20",   dot: "bg-pink-400"   },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", dot: "bg-orange-400" },
};

function getColor(color) {
  return COLOR_MAP[color] || COLOR_MAP.brand;
}

function NoteCard(props) {
  const note     = props.note;
  const onEdit   = props.onEdit;
  const onDelete = props.onDelete;

  const cfg        = getColor(note.color);
  const headerClass = "h-2 w-full rounded-t-2xl " + cfg.bg;
  const dotClass    = "w-2 h-2 rounded-full flex-shrink-0 " + cfg.dot;

  function handleEdit() { onEdit(note); }
  function handleDelete() { onDelete(note); }

  return (
    <div className="card overflow-hidden hover:border-brand-500/20 hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className={headerClass} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={dotClass} />
            <h3 className="font-display font-bold text-white text-base truncate">
              {note.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleEdit}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
            >
              <RiEditLine className="text-sm" />
            </button>
            <button
              onClick={handleDelete}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <RiDeleteBinLine className="text-sm" />
            </button>
          </div>
        </div>

        {note.tag && (
          <span className="badge badge-indigo w-fit mb-3 text-xs">
            {note.tag}
          </span>
        )}

        <p className="text-slate-400 text-sm leading-relaxed flex-1 line-clamp-4">
          {note.content}
        </p>

        <div className="flex items-center gap-1 mt-4 text-slate-600 text-xs">
          <RiTimeLine />
          {note.date}
        </div>
      </div>
    </div>
  );
}

export default NoteCard;