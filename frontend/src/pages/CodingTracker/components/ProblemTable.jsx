import React from "react";
import { FaExternalLinkAlt, FaEdit, FaTrash, FaBookmark, FaRegBookmark, FaCheck, FaRegCircle } from "react-icons/fa";

const DIFFICULTY_STYLES = {
  Easy: "text-emerald-400 bg-emerald-500/10",
  Medium: "text-amber-400 bg-amber-500/10",
  Hard: "text-rose-400 bg-rose-500/10",
};

const PLATFORM_COLORS = {
  LeetCode: "text-amber-400",
  Codeforces: "text-blue-400",
  GeeksforGeeks: "text-emerald-400",
  HackerRank: "text-green-400",
  CodeChef: "text-orange-400",
};

const TABLE_HEADER_CLASS = "text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3";
const TABLE_CELL_CLASS = "px-4 py-4 text-sm";

function ProblemTable(props) {
  const problems = props.problems;

  function handleEdit(problem) {
    return function () {
      props.onEdit(problem);
    };
  }

  function handleDelete(problem) {
    return function () {
      props.onDelete(problem);
    };
  }

  function handleToggleStatus(problemId) {
    return function () {
      props.onToggleStatus(problemId);
    };
  }

  function handleToggleBookmark(problemId) {
    return function () {
      props.onToggleBookmark(problemId);
    };
  }

  function handleOpenLink(url) {
    return function () {
      props.onOpenLink(url);
    };
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border">
              <th className={TABLE_HEADER_CLASS}>Status</th>
              <th className={TABLE_HEADER_CLASS}>Title</th>
              <th className={TABLE_HEADER_CLASS}>Platform</th>
              <th className={TABLE_HEADER_CLASS}>Difficulty</th>
              <th className={TABLE_HEADER_CLASS}>Topic</th>
              <th className={TABLE_HEADER_CLASS}>Time</th>
              <th className={TABLE_HEADER_CLASS}>Date</th>
              <th className={TABLE_HEADER_CLASS + " text-right"}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(function (problem) {
              const difficultyClass = DIFFICULTY_STYLES[problem.difficulty] || "text-gray-400 bg-gray-500/10";
              const platformClass = PLATFORM_COLORS[problem.platform] || "text-gray-400";

              return (
                <tr
                  key={problem.id}
                  className="border-b border-surface-border/50 hover:bg-surface/30 transition-colors"
                >
                  <td className={TABLE_CELL_CLASS}>
                    <button
                      onClick={handleToggleStatus(problem.id)}
                      className="p-1.5 rounded-lg transition-all"
                      title={problem.status === "solved" ? "Mark unsolved" : "Mark solved"}
                    >
                      {problem.status === "solved" ? (
                        <FaCheck size={16} className="text-emerald-400" />
                      ) : (
                        <FaRegCircle size={16} className="text-gray-500 hover:text-emerald-400" />
                      )}
                    </button>
                  </td>
                  <td className={TABLE_CELL_CLASS}>
                    <span className="text-white font-medium">{problem.title}</span>
                  </td>
                  <td className={TABLE_CELL_CLASS}>
                    <span className={"text-sm font-medium " + platformClass}>{problem.platform}</span>
                  </td>
                  <td className={TABLE_CELL_CLASS}>
                    <span className={"px-2.5 py-1 rounded-full text-xs font-medium " + difficultyClass}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className={TABLE_CELL_CLASS}>
                    <span className="text-gray-300 text-sm">{problem.topic}</span>
                  </td>
                  <td className={TABLE_CELL_CLASS}>
                    <span className="text-gray-400 text-sm">
                      {problem.timeSpent > 0 ? problem.timeSpent + " min" : "-"}
                    </span>
                  </td>
                  <td className={TABLE_CELL_CLASS}>
                    <span className="text-gray-400 text-sm">
                      {problem.solvedDate || "-"}
                    </span>
                  </td>
                  <td className={TABLE_CELL_CLASS + " text-right"}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={handleToggleBookmark(problem.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all"
                        title={problem.bookmarked ? "Remove bookmark" : "Bookmark"}
                      >
                        {problem.bookmarked ? (
                          <FaBookmark size={14} className="text-pink-400" />
                        ) : (
                          <FaRegBookmark size={14} />
                        )}
                      </button>
                      <button
                        onClick={handleOpenLink(problem.link)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-all"
                        title="Open link"
                      >
                        <FaExternalLinkAlt size={14} />
                      </button>
                      <button
                        onClick={handleEdit(problem)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={handleDelete(problem)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProblemTable;