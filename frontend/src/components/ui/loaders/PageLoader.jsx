import React from "react";
import { FaSpinner } from "react-icons/fa";

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center">
          <FaSpinner size={32} className="text-brand-400 animate-spin" />
        </div>
        <p className="text-gray-400 text-sm font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

export default PageLoader;