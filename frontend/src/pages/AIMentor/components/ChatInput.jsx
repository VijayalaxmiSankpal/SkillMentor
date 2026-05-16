import React from "react";
import { useState, useRef } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

function ChatInput(props) {
  const isLoading = props.isLoading;
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    props.onSendMessage(message);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function handleInput() {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }

  const inputClass = "flex-1 bg-surface border border-surface-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm resize-none min-h-[44px] max-h-[120px]";
  const btnClass = "p-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Ask your AI mentor anything..."
        rows={1}
        className={inputClass}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className={btnClass}
      >
        {isLoading ? <FaSpinner size={16} className="animate-spin" /> : <FaPaperPlane size={16} />}
      </button>
    </form>
  );
}

export default ChatInput;