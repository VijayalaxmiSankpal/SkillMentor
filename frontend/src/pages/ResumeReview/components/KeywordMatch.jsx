import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

function KeywordMatch(props) {
  const keywords = props.keywords;
  const matched = keywords.matched;
  const missing = keywords.missing;
  const score = keywords.score;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-base">Keyword Analysis</h3>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">Match Score</span>
          <span className={"text-sm font-bold " + (score >= 70 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400")}>
            {score}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaCheck size={14} className="text-emerald-400" />
            <h4 className="text-sm font-medium text-white">Matched Keywords</h4>
            <span className="badge-green text-xs px-2 py-0.5">{matched.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matched.map(function (keyword) {
              return (
                <span key={keyword} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                  {keyword}
                </span>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaTimes size={14} className="text-rose-400" />
            <h4 className="text-sm font-medium text-white">Missing Keywords</h4>
            <span className="badge-rose text-xs px-2 py-0.5">{missing.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.map(function (keyword) {
              return (
                <span key={keyword} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium border border-rose-500/20">
                  {keyword}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeywordMatch;