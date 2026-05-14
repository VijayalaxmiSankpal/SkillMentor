import React from "react";
import { FaFilePdf, FaTrash, FaEye } from "react-icons/fa";

function ResumeHistory(props) {
  const history = props.history;

  if (history.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
          <FaFilePdf size={28} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">No review history</h3>
        <p className="text-gray-400 text-sm">Upload your resume to see review history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map(function (item) {
        function handleDelete() {
          props.onDelete(item.id);
        }

        function handleView() {
          props.onView(item)();
        }

        let scoreColor = "text-rose-400";
        if (item.atsScore >= 80) {
          scoreColor = "text-emerald-400";
        } else if (item.atsScore >= 60) {
          scoreColor = "text-amber-400";
        }

        return (
          <div key={item.id} className="card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
              <FaFilePdf size={20} className="text-rose-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{item.fileName}</p>
              <p className="text-gray-500 text-xs">
                {new Date(item.reviewedAt).toLocaleDateString()} at {new Date(item.reviewedAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className={"text-lg font-bold " + scoreColor}>{item.atsScore}</p>
                <p className="text-gray-500 text-xs">ATS Score</p>
              </div>
              <button
                onClick={handleView}
                className="p-2 rounded-lg text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
                title="View results"
              >
                <FaEye size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                title="Delete"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ResumeHistory;