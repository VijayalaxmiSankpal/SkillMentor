import React from "react";
import { FaLightbulb } from "react-icons/fa";

function SuggestionChips(props) {
  const suggestions = props.suggestions;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map(function (suggestion, index) {
        function handleClick() {
          props.onSuggestionClick(suggestion)();
        }
        return (
          <button
            key={index}
            onClick={handleClick}
            className="px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-border border border-surface-border text-gray-300 hover:text-white text-sm transition-all flex items-center gap-2"
          >
            <FaLightbulb size={12} className="text-brand-400" />
            {suggestion}
          </button>
        );
      })}
    </div>
  );
}

export default SuggestionChips;