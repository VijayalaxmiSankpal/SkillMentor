import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaHourglassHalf,
  FaAlignLeft,
  FaStar,
  FaPlay,
} from "react-icons/fa";
import RatingStars from "./RatingStars";

const TYPE_COLORS = {
  technical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "system-design": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  behavioral: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  coding: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  hr: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function InterviewCard(props) {
  const interview = props.interview;
  const showActions = props.showActions !== false;
  const showFeedback = props.showFeedback !== false;

  const normalizedStatus = interview.status?.toLowerCase() || "scheduled";

  const typeClass =
    TYPE_COLORS[interview.type] ||
    "bg-gray-500/10 text-gray-400 border-gray-500/20";

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={"px-2.5 py-1 rounded-lg text-xs font-medium border " + typeClass}>
            {interview.type}
          </span>

          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-400">
            <FaClock size={10} />
            {normalizedStatus}
          </span>
        </div>

        {interview.rating && showFeedback && (
          <RatingStars rating={interview.rating} size={14} />
        )}
      </div>

      <h3 className="text-white font-semibold text-base mb-1">
        {interview.role}
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4 mt-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <FaCalendarAlt size={12} className="text-gray-500" />
          {interview.date}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <FaClock size={12} className="text-gray-500" />
          {interview.time}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <FaHourglassHalf size={12} className="text-gray-500" />
          {interview.duration} min
        </div>
      </div>

      {interview.feedback && showFeedback && (
        <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 mb-4">
          <p className="text-gray-300 text-xs italic">{interview.feedback}</p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2">
          {normalizedStatus === "scheduled" && (
            <>
              <button
                onClick={() => props.onStart && props.onStart(interview)}
                className="flex-1 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 font-medium py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <FaPlay size={10} />
                Start Interview
              </button>

              <button
                onClick={() => props.onCancel(interview.id)}
                className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-medium py-2 rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
            </>
          )}

          {normalizedStatus === "completed" && (
            <button
              onClick={() => props.onShowFeedback(interview.id)}
              className="w-full bg-surface hover:bg-surface-border text-gray-300 border border-surface-border font-medium py-2 rounded-xl text-xs transition-all"
            >
              View AI Feedback
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default InterviewCard;