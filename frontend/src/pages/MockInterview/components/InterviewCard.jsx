import React from "react";
import { FaCalendarAlt, FaClock, FaHourglassHalf, FaAlignLeft, FaStar } from "react-icons/fa";
import RatingStars from "./RatingStars";

const TYPE_COLORS = {
  Technical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "System Design": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Behavioral: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Coding: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "HR Round": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function InterviewCard(props) {
  const interview = props.interview;
  const showActions = props.showActions !== false;
  const showFeedback = props.showFeedback !== false;

  function handleCancel() {
    props.onCancel(interview.id);
  }

  function handleComplete() {
    props.onComplete(interview.id);
  }

  function handleShowFeedback() {
    props.onShowFeedback(interview.id);
  }

  const typeClass = TYPE_COLORS[interview.type] || "bg-gray-500/10 text-gray-400 border-gray-500/20";

  const statusConfig = {
    scheduled: { icon: FaClock, color: "text-brand-400", bg: "bg-brand-500/10", label: "Scheduled" },
    completed: { icon: FaStar, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Completed" },
    missed: { icon: FaClock, color: "text-rose-400", bg: "bg-rose-500/10", label: "Missed" },
  };

  const statusInfo = statusConfig[interview.status] || statusConfig.scheduled;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={"px-2.5 py-1 rounded-lg text-xs font-medium border " + typeClass}>
            {interview.type}
          </span>
          <span className={"flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium " + statusInfo.bg + " " + statusInfo.color}>
            <StatusIcon size={10} />
            {statusInfo.label}
          </span>
        </div>
        {interview.rating && showFeedback && (
          <RatingStars rating={interview.rating} size={14} />
        )}
      </div>

      <h3 className="text-white font-semibold text-base mb-1">{interview.role}</h3>
      <p className="text-gray-400 text-xs mb-4">{interview.company}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
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

      {interview.notes && (
        <div className="flex items-start gap-2 p-3 bg-surface/50 rounded-xl border border-surface-border mb-4">
          <FaAlignLeft size={12} className="text-gray-500 mt-0.5 shrink-0" />
          <p className="text-gray-300 text-xs">{interview.notes}</p>
        </div>
      )}

      {interview.feedback && showFeedback && (
        <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 mb-4">
          <p className="text-gray-300 text-xs italic">{interview.feedback}</p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2">
          {interview.status === "scheduled" && (
            <React.Fragment>
              <button
                onClick={handleComplete}
                className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-medium py-2 rounded-xl text-xs transition-all"
              >
                Mark Complete
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-medium py-2 rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
            </React.Fragment>
          )}
          {interview.status === "completed" && !interview.feedback && (
            <button
              onClick={handleShowFeedback}
              className="w-full bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 font-medium py-2 rounded-xl text-xs transition-all"
            >
              Add Feedback
            </button>
          )}
          {interview.status === "completed" && interview.feedback && (
            <button
              onClick={handleShowFeedback}
              className="w-full bg-surface hover:bg-surface-border text-gray-300 border border-surface-border font-medium py-2 rounded-xl text-xs transition-all"
            >
              Edit Feedback
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default InterviewCard;