import React from "react";
import { FaGhost, FaArrowLeft, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TITLE = "404 - Page Not Found";
const MESSAGE = "The page you're looking for doesn't exist or has been moved.";

function NotFoundPage() {
  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }

  function handleGoHome() {
    navigate("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-3xl bg-brand-500/10 flex items-center justify-center mx-auto mb-6">
          <FaGhost size={48} className="text-brand-400" />
        </div>
        <h1 className="text-6xl font-display font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-white mb-3">{TITLE}</h2>
        <p className="text-gray-400 text-sm mb-8">{MESSAGE}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface hover:bg-surface-border text-gray-300 hover:text-white text-sm font-medium transition-all border border-surface-border"
          >
            <FaArrowLeft size={14} />
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-all"
          >
            <FaHome size={14} />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;