import React from "react";
import { RiDeleteBinLine, RiCloseLine } from "react-icons/ri";

function DeleteModal(props) {
  const note       = props.note;
  const onConfirm  = props.onConfirm;
  const onClose    = props.onClose;

  if (!note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative card p-6 w-full max-w-sm animate-fade-in">

        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <RiDeleteBinLine className="text-red-400 text-lg" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <RiCloseLine className="text-lg" />
          </button>
        </div>

        <h3 className="font-display text-lg font-bold text-white mb-2">
          Delete Note
        </h3>
        <p className="text-slate-400 text-sm mb-1">
          Are you sure you want to delete this note?
        </p>
        <p className="text-white font-semibold text-sm mb-6 truncate">
          {note.title}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
          >
            <RiDeleteBinLine />
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}

export default DeleteModal;