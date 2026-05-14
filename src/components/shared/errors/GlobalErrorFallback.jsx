import React from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

function GlobalErrorFallback(props) {
  const error = props.error;

  function handleReset() {
    props.onReset();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle size={40} className="text-rose-400" />
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-3">Something Went Wrong</h1>
        <p className="text-gray-400 text-sm mb-6">
          An unexpected error occurred. We've logged the issue and our team will look into it.
        </p>
        {error && (
          <div className="p-4 bg-surface-card rounded-xl border border-surface-border mb-6 text-left">
            <p className="text-rose-400 text-xs font-mono break-all">{error.toString()}</p>
          </div>
        )}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium transition-all mx-auto"
        >
          <FaRedo size={14} />
          Try Again
        </button>
      </div>
    </div>
  );
}

export default GlobalErrorFallback;