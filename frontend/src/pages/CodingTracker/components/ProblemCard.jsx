import React from "react";
import { FaExternalLinkAlt, FaEdit, FaTrash, FaBookmark, FaRegBookmark, FaCheck, FaRegCircle } from "react-icons/fa";

const DIFFICULTY_STYLES = {
  Easy: "badge-green",
  Medium: "badge-amber",
  Hard: "badge-rose",
};

const PLATFORM_COLORS = {
  LeetCode: "text-amber-400",
  Codeforces: "text-blue-400",
  GeeksforGeeks: "text-emerald-400",
  HackerRank: "text-green-400",
  CodeChef: "text-brown-400",
};

const STATUS_STYLES = {
  solved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  unsolved: "bg-surface text-gray-400 border-surface-border",
};

function ProblemCard(props) {
  const problem = props.problem;

  function handleEdit() {
    props.onEdit(problem);
  }

  function handleDelete() {
    props.onDelete(problem);
  }

  function handleToggleStatus() {
    props.onToggleStatus(problem.id);
  }

  function handleToggleBookmark() {
    props.onToggleBookmark(problem.id);
  }

  function handleOpenLink() {
    props.onOpenLink(problem.link);
  }

  const difficultyBadgeClass = DIFFICULTY_STYLES[problem.difficulty] || "badge-slate";
  const platformColorClass = PLATFORM_COLORS[problem.platform] || "text-gray-400";
  const statusClass = STATUS_STYLES[problem.status];

  const cardClass = problem.status === "solved"
    ? "card p-5 border-l-4 border-l-emerald-500"
    : "card p-5 border-l-4 border-l-surface-border";

  return (
    <div className={cardClass}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={difficultyBadgeClass + " text-xs px-2.5 py-1"}>{problem.difficulty}</span>
          <span className={"text-xs font-medium " + platformColorClass}>{problem.platform}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleBookmark}
            className="p-1.5 rounded-lg text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all"
            title={problem.bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {problem.bookmarked ? <FaBookmark size={14} className="text-pink-400" /> : <FaRegBookmark size={14} />}
          </button>
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-base mb-2 line-clamp-2">{problem.title}</h3>

      {/* Topic & Time */}
      <div className="flex items-center justify-between mb-3">
        <span className="badge-indigo text-xs px-2.5 py-1">{problem.topic}</span>
        {problem.timeSpent > 0 && (
          <span className="text-xs text-gray-400">{problem.timeSpent} min</span>
        )}
      </div>

      {/* Notes */}
      {problem.notes && (
        <p className="text-gray-400 text-xs mb-3 line-clamp-2 bg-surface/50 p-2 rounded-lg">{problem.notes}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-border">
        <button
          onClick={handleToggleStatus}
          className={"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all " + statusClass}
        >
          {problem.status === "solved" ? <FaCheck size={12} /> : <FaRegCircle size={12} />}
          {problem.status === "solved" ? "Solved" : "Mark Solved"}
        </button>
        <button
          onClick={handleOpenLink}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-all"
          title="Open in platform"
        >
          <FaExternalLinkAlt size={14} />
        </button>
      </div>

      {/* Solved Date */}
      {problem.solvedDate && (
        <p className="text-xs text-gray-500 mt-2">Solved on {problem.solvedDate}</p>
      )}
    </div>
  );
}

export default ProblemCard;