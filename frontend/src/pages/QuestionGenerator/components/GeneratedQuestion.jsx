import React from "react";
import { useState } from "react";
import { FaBookmark, FaRegBookmark, FaCopy, FaChevronDown, FaChevronUp } from "react-icons/fa";
import DifficultyBadge from "./DifficultyBadge";

function GeneratedQuestion(props) {
  const question = props.question;
  const [showAnswer, setShowAnswer] = useState(false);

  function handleToggleAnswer() {
    setShowAnswer(!showAnswer);
  }

  function handleSave() {
    props.onSave(question)();
  }

  function handleCopy() {
    props.onCopy(question.question)();
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <DifficultyBadge difficulty={question.difficulty} />
          <span className="badge-indigo text-xs px-2 py-0.5">{question.topic}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-all"
            title="Copy question"
          >
            <FaCopy size={14} />
          </button>
          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all"
            title="Save question"
          >
            {question.saved ? <FaBookmark size={14} className="text-pink-400" /> : <FaRegBookmark size={14} />}
          </button>
        </div>
      </div>

      <p className="text-white text-sm font-medium mb-3">{question.question}</p>

      <button
        onClick={handleToggleAnswer}
        className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-all mb-2"
      >
        {showAnswer ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
        {showAnswer ? "Hide Answer" : "Show Answer"}
      </button>

      {showAnswer && (
        <div className="p-3 bg-surface/50 rounded-xl border border-surface-border">
          <p className="text-gray-300 text-sm leading-relaxed">{question.answer}</p>
        </div>
      )}
    </div>
  );
}

export default GeneratedQuestion;