import React from "react";

function TypingIndicator() {
  const dotClass = "w-2 h-2 rounded-full bg-brand-400 animate-bounce";

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-400">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v1a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7v-1H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        </svg>
      </div>
      <div className="bg-surface border border-surface-border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className={dotClass} style={{ animationDelay: "0ms" }} />
          <div className={dotClass} style={{ animationDelay: "150ms" }} />
          <div className={dotClass} style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;