import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

function ReviewResult(props) {
  const feedback = props.feedback;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <FaQuoteLeft size={16} className="text-brand-400" />
        <h3 className="text-white font-semibold text-sm">AI Feedback</h3>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{feedback}</p>
    </div>
  );
}

export default ReviewResult;