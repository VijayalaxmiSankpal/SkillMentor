import React from "react";
import { FaTrash, FaCopy, FaBookmark } from "react-icons/fa";
import DifficultyBadge from "./DifficultyBadge";

function SavedQuestions(props) {
  const questions = props.questions;

  if (questions.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
          <FaBookmark size={28} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">No saved questions</h3>
        <p className="text-gray-400 text-sm">Generate and save questions to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-base">Saved Questions</h3>
        <span className="text-gray-400 text-xs">{questions.length} saved</span>
      </div>
      {questions.map(function (question) {
        function handleDelete() {
          props.onDelete(question._id || question.id)
        }

        function handleCopy() {
          props.onCopy(question.question)();
        }

        return (
          <div key={question.id} className="card p-5 border-l-4 border-l-brand-500">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <DifficultyBadge difficulty={question.difficulty} />
                <span className="badge-indigo text-xs px-2 py-0.5">{question.topic}</span>
                <span className="text-xs text-gray-500">{question.roleId}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-all"
                  title="Copy"
                >
                  <FaCopy size={14} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  title="Remove"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
            <p className="text-white text-sm font-medium mb-2">{question.question}</p>
            <div className="p-3 bg-surface/50 rounded-xl border border-surface-border">
              <p className="text-gray-300 text-sm leading-relaxed">{question.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SavedQuestions;