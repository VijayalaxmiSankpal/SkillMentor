import React, { useEffect, useRef, useState } from "react";
import { FaRobot, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import ChatSidebar from "./components/ChatSidebar";
import EmptyState from "./components/EmptyState";
import aiService from "../../services/aiService";

const SUGGESTION_CHIPS = [
  "Help me prepare for a React interview",
  "What skills do I need for a senior role?",
  "Review my system design approach",
  "How to negotiate salary effectively?",
  "Tips for behavioral interviews",
  "Create a 30-60-90 day plan",
];

function AIMentorPage() {
  const [conversations, setConversations] = useState([
    {
      id: null,
      title: "New Conversation",
      timestamp: new Date().toISOString(),
      messages: [],
    },
  ]);

  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ||
    conversations[0];

  const activeMessages = activeConversation ? activeConversation.messages : [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages, isLoading]);

  function handleNewChat() {
    const newConversation = {
      id: null,
      title: "New Conversation",
      timestamp: new Date().toISOString(),
      messages: [],
    };

    setConversations([newConversation]);
    setActiveConversationId(null);
  }

  function handleSelectConversation(conversationId) {
    return function () {
      setActiveConversationId(conversationId);
    };
  }

  function handleDeleteConversation(conversationId) {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== conversationId);

      if (filtered.length === 0) {
        return [
          {
            id: null,
            title: "New Conversation",
            timestamp: new Date().toISOString(),
            messages: [],
          },
        ];
      }

      return filtered;
    });

    setActiveConversationId(null);
    toast.success("Conversation deleted");
  }

  async function handleSendMessage(content) {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    const currentChatId = activeConversation?.id || null;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            title:
              c.messages.length === 0
                ? content.trim().slice(0, 30)
                : c.title,
            messages: [...c.messages, userMessage],
            timestamp: new Date().toISOString(),
          };
        }

        return c;
      })
    );

    setIsLoading(true);

    try {
      const response = await aiService.mentorChat(content.trim(), currentChatId);

      const data = response.data;
      const reply = data.reply;
      const chatId = data.chatId;

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversationId || c.id === null) {
            return {
              ...c,
              id: chatId,
              title:
                c.messages.length <= 1
                  ? content.trim().slice(0, 30)
                  : c.title,
              messages: [...c.messages, assistantMessage],
              timestamp: new Date().toISOString(),
            };
          }

          return c;
        })
      );

      setActiveConversationId(chatId);
    } catch (error) {
      console.error("AI mentor failed:", error);
      toast.error(error?.response?.data?.message || "AI mentor failed");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSuggestionClick(suggestion) {
    return function () {
      handleSendMessage(suggestion);
    };
  }

  return (
    <React.Fragment>
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onNewChat={handleNewChat}
        />

        <div className="flex-1 flex flex-col card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-surface-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <FaRobot size={20} className="text-brand-400" />
              </div>

              <div>
                <h2 className="text-white font-semibold text-sm">
                  {activeConversation
                    ? activeConversation.title
                    : "New Conversation"}
                </h2>

                <p className="text-gray-400 text-xs">
                  {isLoading ? "Typing..." : "AI Career Mentor"}
                </p>
              </div>
            </div>

            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface hover:bg-surface-border text-gray-300 hover:text-white text-xs font-medium transition-all border border-surface-border"
            >
              <FaPlus size={12} />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeMessages.length === 0 ? (
              <EmptyState
                suggestions={SUGGESTION_CHIPS}
                onSuggestionClick={handleSuggestionClick}
              />
            ) : (
              <ChatContainer messages={activeMessages} isLoading={isLoading} />
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-surface-border shrink-0">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default AIMentorPage;