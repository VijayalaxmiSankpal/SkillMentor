import React from "react";
import { FaRobot, FaLightbulb } from "react-icons/fa";
import SuggestionChips from "./SuggestionChips";

function EmptyState(props) {
  const suggestions = props.suggestions;

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-2">
        <FaRobot size={40} className="text-brand-400" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-display font-bold text-white mb-2">AI Career Mentor</h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Your personal AI assistant for career guidance, interview preparation, resume reviews, and technical advice. Ask anything!
        </p>
      </div>
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-3 justify-center">
          <FaLightbulb size={14} className="text-brand-400" />
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Suggested Questions</span>
        </div>
        <SuggestionChips
          suggestions={suggestions}
          onSuggestionClick={props.onSuggestionClick}
        />
      </div>
    </div>
  );
}

export default EmptyState;