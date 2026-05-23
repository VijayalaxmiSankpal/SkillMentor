import React from "react";
import {
  FaEdit,
  FaTrash,
  FaBookmark,
  FaRegBookmark,
  FaCheck,
  FaRegCircle,
  FaChevronDown,
  FaChevronUp,
  FaBrain,
} from "react-icons/fa";
import { useState } from "react";

const DIFFICULTY_STYLES = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

function QuestionList(props) {
  const questions = props.questions;
  const topics = props.topics;

  const [expandedId, setExpandedId] = useState(null);

  function handleEdit(question) {
    return function () {
      props.onEdit(question);
    };
  }

  function handleDelete(questionId) {
    return function () {
      props.onDelete(questionId);
    };
  }

  function handleToggleStatus(questionId) {
    return function () {
      props.onToggleStatus(questionId);
    };
  }

  function handleToggleBookmark(questionId) {
    return function () {
      props.onToggleBookmark(questionId);
    };
  }

  function handleToggleExpand(questionId) {
    return function () {
      setExpandedId(expandedId === questionId ? null : questionId);
    };
  }

  function getTopicName(topicId) {
    const topic = topics.find(function (t) {
      return t.id === topicId;
    });
    return topic ? topic.name : topicId;
  }

  if (questions.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
          <FaBrain size={28} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">No questions found</h3>
        <p className="text-gray-400 text-sm">Try adjusting your filters or add a new question.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map(function (question) {
        const isExpanded = expandedId === question.id;
        const difficultyClass = DIFFICULTY_STYLES[question.difficulty] || "text-gray-400 bg-gray-500/10";

        return (
          <div
            key={question.id}
            className={"card p-4 transition-all " + (question.status === "completed" ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-surface-border")}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={handleToggleStatus(question.id)}
                className="mt-1 p-1 rounded-lg transition-all shrink-0"
                title={question.status === "completed" ? "Mark incomplete" : "Mark complete"}
              >
                {question.status === "completed" ? (
                  <FaCheck size={18} className="text-emerald-400" />
                ) : (
                  <FaRegCircle size={18} className="text-gray-500 hover:text-emerald-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={"px-2 py-0.5 rounded-md text-xs font-medium border " + difficultyClass}>
                        {question.difficulty}
                      </span>
                      <span className="badge-indigo text-xs px-2 py-0.5">
                        {getTopicName(question.topicId)}
                      </span>
                      {question.timesRevised > 0 && (
                        <span className="text-xs text-gray-500">
                          Revised {question.timesRevised}x
                        </span>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium">{question.question}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={handleToggleBookmark(question.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all"
                    >
                      {question.bookmarked ? (
                        <FaBookmark size={14} className="text-pink-400" />
                      ) : (
                        <FaRegBookmark size={14} />
                      )}
                    </button>
                    <button
                      onClick={handleEdit(question)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={handleDelete(question.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleToggleExpand(question.id)}
                  className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 mt-2 transition-all"
                >
                  {isExpanded ? (
                    <React.Fragment>
                      <FaChevronUp size={10} /> Hide Answer
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <FaChevronDown size={10} /> Show Answer
                    </React.Fragment>
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-3 p-3 bg-surface/50 rounded-xl border border-surface-border">
                    <p className="text-gray-300 text-sm leading-relaxed">{question.answer}</p>
                    {question.lastRevised && (
                      <p className="text-xs text-gray-500 mt-2">Last revised: {question.lastRevised}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default QuestionList;