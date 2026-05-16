import React from "react";
import { FaPlus, FaTrash, FaComments, FaRobot } from "react-icons/fa";

function ChatSidebar(props) {
  const conversations = props.conversations;
  const activeConversationId = props.activeConversationId;

  function handleNewChat() {
    props.onNewChat();
  }

  function handleSelect(conversationId) {
    return function () {
      props.onSelectConversation(conversationId)();
    };
  }

  function handleDelete(e, conversationId) {
    e.stopPropagation();
    props.onDeleteConversation(conversationId);
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="w-72 card flex flex-col overflow-hidden shrink-0 hidden lg:flex">
      {/* Header */}
      <div className="p-4 border-b border-surface-border shrink-0">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all text-sm"
        >
          <FaPlus size={14} />
          New Chat
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center p-6">
            <FaRobot size={24} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">No conversations yet</p>
          </div>
        ) : (
          conversations.map(function (conversation) {
            const isActive = conversation.id === activeConversationId;
            const itemClass = isActive
              ? "bg-brand-500/10 border-brand-500/20 text-white"
              : "bg-transparent border-transparent text-gray-400 hover:bg-surface hover:text-gray-300";

            return (
              <div
                key={conversation.id}
                onClick={handleSelect(conversation.id)}
                className={"group flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all " + itemClass}
              >
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                  <FaComments size={14} className={isActive ? "text-brand-400" : "text-gray-500"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conversation.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {conversation.messages.length} messages
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-500">{formatDate(conversation.timestamp)}</span>
                  <button
                    onClick={function (e) {
                      handleDelete(e, conversation.id);
                    }}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete conversation"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ChatSidebar;