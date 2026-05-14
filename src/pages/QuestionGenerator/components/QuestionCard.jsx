import React from "react";
import { FaBookmark, FaRegBookmark, FaCopy } from "react-icons/fa";
import DifficultyBadge from "./DifficultyBadge";

function QuestionCard(props) {
  const question = props.question;
  const showActions = props.showActions !== false;

  function handleSave() {
    if (props.onSave) {
      props.onSave(question)();
    }
  }

  function handleCopy() {
    if (props.onCopy) {
      props.onCopy(question.question)();
    }
  }

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <DifficultyBadge difficulty={question.difficulty} />
            <span className="badge-indigo text-xs px-2 py-0.5">{question.topic}</span>
          </div>
          <p className="text-white text-sm font-medium">{question.question}</p>
        </div>
        {showActions && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-all"
            >
              <FaCopy size={14} />
            </button>
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all"
            >
              {question.saved ? <FaBookmark size={14} className="text-pink-400" /> : <FaRegBookmark size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionCard;