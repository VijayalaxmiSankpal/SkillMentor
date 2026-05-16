import React from "react";
import { FaUser, FaRobot } from "react-icons/fa";

function ChatMessage(props) {
  const message = props.message;
  const isUser = message.role === "user";

  const avatarClass = isUser
    ? "bg-emerald-500/10 text-emerald-400"
    : "bg-brand-500/10 text-brand-400";

  const bubbleClass = isUser
    ? "bg-brand-500 text-white rounded-2xl rounded-tr-sm"
    : "bg-surface border border-surface-border text-gray-200 rounded-2xl rounded-tl-sm";

  const alignClass = isUser ? "flex-row-reverse" : "flex-row";

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatContent(content) {
    const lines = content.split("\n");
    return lines.map(function (line, index) {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={index} className="font-semibold text-white mt-2 mb-1">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 text-sm leading-relaxed">
            {line.replace("- ", "")}
          </li>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <li key={index} className="ml-4 text-sm leading-relaxed list-decimal">
            {line.replace(/^\d+\.\s*/, "")}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={index} className="h-2" />;
      }
      return (
        <p key={index} className="text-sm leading-relaxed">
          {line}
        </p>
      );
    });
  }

  return (
    <div className={"flex gap-3 " + alignClass}>
      <div className={"w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 " + avatarClass}>
        {isUser ? <FaUser size={14} /> : <FaRobot size={14} />}
      </div>
      <div className={"max-w-[80%] px-4 py-3 " + bubbleClass}>
        <div className="space-y-1">
          {formatContent(message.content)}
        </div>
        <p className={"text-xs mt-2 " + (isUser ? "text-brand-200" : "text-gray-500")}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

export default ChatMessage;