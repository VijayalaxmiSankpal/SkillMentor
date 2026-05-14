import React from "react";
import { FaRedo, FaBookmark, FaRegBookmark, FaCheck, FaCalendarAlt } from "react-icons/fa";

const DIFFICULTY_STYLES = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

function RevisionSection(props) {
  const questions = props.questions;
  const topics = props.topics;

  function handleMarkRevised(questionId) {
    return function () {
      props.onMarkRevised(questionId);
    };
  }

  function handleToggleBookmark(questionId) {
    return function () {
      props.onToggleBookmark(questionId);
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
          <FaCheck size={28} className="text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">All caught up!</h3>
        <p className="text-gray-400 text-sm">No questions due for revision. Great job keeping up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          <span className="text-white font-semibold">{questions.length}</span> questions need revision
        </p>
      </div>

      {questions.map(function (question) {
        const difficultyClass = DIFFICULTY_STYLES[question.difficulty] || "text-gray-400 bg-gray-500/10";

        return (
          <div key={question.id} className="card p-4 border-l-4 border-l-brand-500">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={"px-2 py-0.5 rounded-md text-xs font-medium border " + difficultyClass}>
                    {question.difficulty}
                  </span>
                  <span className="badge-indigo text-xs px-2 py-0.5">
                    {getTopicName(question.topicId)}
                  </span>
                  {question.revisionDate && (
                    <span className="flex items-center gap-1 text-xs text-amber-400">
                      <FaCalendarAlt size={10} />
                      Due: {question.revisionDate}
                    </span>
                  )}
                </div>
                <p className="text-white text-sm font-medium mb-2">{question.question}</p>
                <div className="p-3 bg-surface/50 rounded-xl border border-surface-border">
                  <p className="text-gray-300 text-sm leading-relaxed">{question.answer}</p>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-gray-500">
                    Revised {question.timesRevised} times
                  </span>
                  {question.lastRevised && (
                    <span className="text-xs text-gray-500">
                      Last: {question.lastRevised}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 shrink-0">
                <button
                  onClick={handleMarkRevised(question.id)}
                  className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition-all"
                  title="Mark as revised"
                >
                  <FaRedo size={14} />
                </button>
                <button
                  onClick={handleToggleBookmark(question.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all"
                >
                  {question.bookmarked ? (
                    <FaBookmark size={14} className="text-pink-400" />
                  ) : (
                    <FaRegBookmark size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RevisionSection;