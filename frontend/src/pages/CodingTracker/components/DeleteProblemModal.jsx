import React from "react";
import { FaTimes, FaExclamationTriangle, FaTrash } from "react-icons/fa";

const TITLE = "Delete Problem";
const MESSAGE = "Are you sure you want to delete this problem? This action cannot be undone.";
const CANCEL_TEXT = "Cancel";
const DELETE_TEXT = "Delete";

function DeleteProblemModal(props) {
  const problem = props.problem;

  function handleClose() {
    props.onClose();
  }

  function handleConfirm() {
    props.onConfirm();
  }

  const overlayClass = "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4";
  const modalClass = "bg-surface-card border border-surface-border rounded-2xl w-full max-w-md shadow-2xl";

  return (
    <div className={overlayClass} onClick={handleClose}>
      <div className={modalClass} onClick={function (e) { e.stopPropagation(); }}>
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle size={28} className="text-rose-400" />
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-2">{TITLE}</h3>
          <p className="text-gray-400 text-sm mb-6">{MESSAGE}</p>
          <p className="text-white font-medium text-sm mb-6 bg-surface p-3 rounded-xl">
            {problem.title}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-surface hover:bg-surface-border text-white font-medium py-2.5 px-5 rounded-xl transition-all border border-surface-border"
            >
              {CANCEL_TEXT}
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FaTrash size={14} />
              {DELETE_TEXT}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteProblemModal;