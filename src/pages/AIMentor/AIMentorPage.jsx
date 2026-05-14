import React from "react";
import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import ChatSidebar from "./components/ChatSidebar";
import EmptyState from "./components/EmptyState";

const PAGE_TITLE = "AI Career Mentor";
const PAGE_SUBTITLE = "Get personalized career advice, interview tips, and guidance from your AI assistant";

const INITIAL_CONVERSATIONS = [
  {
    id: 1,
    title: "Frontend Career Path",
    timestamp: "2025-05-14T10:30:00",
    messages: [
      {
        id: 1,
        role: "user",
        content: "I want to become a senior frontend developer. What should I focus on?",
        timestamp: "2025-05-14T10:30:00",
      },
      {
        id: 2,
        role: "assistant",
        content: "Great goal! To become a senior frontend developer, focus on these key areas:\n\n1. **Deep React Knowledge** - Advanced patterns like compound components, render props, custom hooks, and performance optimization with React.memo and useMemo.\n\n2. **TypeScript Mastery** - Type guards, generics, conditional types, and building type-safe APIs.\n\n3. **System Design** - Understanding micro-frontends, module federation, and scalable architecture patterns.\n\n4. **Testing** - Write comprehensive tests using Jest, React Testing Library, and Cypress for E2E.\n\n5. **Performance** - Core Web Vitals, lazy loading, code splitting, and bundle optimization.\n\n6. **DevOps Basics** - CI/CD pipelines, Docker, and cloud deployment (Vercel, AWS, Netlify).\n\nWould you like me to create a detailed roadmap for any of these areas?",
        timestamp: "2025-05-14T10:30:15",
      },
    ],
  },
  {
    id: 2,
    title: "System Design Interview",
    timestamp: "2025-05-13T16:45:00",
    messages: [
      {
        id: 1,
        role: "user",
        content: "How do I design a scalable URL shortener?",
        timestamp: "2025-05-13T16:45:00",
      },
      {
        id: 2,
        role: "assistant",
        content: "Designing a URL shortener like bit.ly involves several components:\n\n**API Design:**\n- POST /shorten - Create short URL\n- GET /{shortCode} - Redirect to original URL\n\n**Database:**\n- Use NoSQL (DynamoDB/Cassandra) for high write throughput\n- Store mapping: shortCode -> originalURL, createdAt, expiry\n\n**Hashing Strategy:**\n- Base62 encoding of auto-increment ID\n- Or MD5 hash first 6-8 chars with collision handling\n\n**Scaling:**\n- Cache hot URLs in Redis (80/20 rule)\n- CDN for edge caching\n- Rate limiting to prevent abuse\n\n**Analytics:**\n- Async logging to Kafka/ClickHouse\n- Track clicks, geolocation, referrers\n\nWant me to dive deeper into any specific component?",
        timestamp: "2025-05-13T16:45:20",
      },
    ],
  },
  {
    id: 3,
    title: "Resume Review Tips",
    timestamp: "2025-05-12T09:15:00",
    messages: [
      {
        id: 1,
        role: "user",
        content: "Can you review my resume structure?",
        timestamp: "2025-05-12T09:15:00",
      },
      {
        id: 2,
        role: "assistant",
        content: "Here are key principles for a strong tech resume:\n\n**Structure:**\n1. Header - Name, title, contact, GitHub/LinkedIn/Portfolio\n2. Summary - 2-3 lines highlighting expertise and impact\n3. Skills - Group by category (Frontend, Backend, Tools, Cloud)\n4. Experience - STAR method, quantify everything\n5. Projects - Production apps with metrics, not tutorials\n6. Education - Degree, certifications, relevant coursework\n\n**Tips:**\n- Use action verbs: Built, Architected, Optimized, Led\n- Quantify: \"Reduced load time by 40%\" not \"Improved performance\"\n- One page for <5 years, two pages max for senior roles\n- ATS-friendly: No tables, standard fonts, keyword match job description\n\nPaste your resume content and I'll give specific feedback!",
        timestamp: "2025-05-12T09:15:30",
      },
    ],
  },
];

const SUGGESTION_CHIPS = [
  "Help me prepare for a React interview",
  "What skills do I need for a senior role?",
  "Review my system design approach",
  "How to negotiate salary effectively?",
  "Tips for behavioral interviews",
  "Create a 30-60-90 day plan",
];

function AIMentorPage() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(function (c) {
    return c.id === activeConversationId;
  });

  const activeMessages = activeConversation ? activeConversation.messages : [];

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(function () {
    scrollToBottom();
  }, [activeMessages, isLoading]);

  function handleNewChat() {
    const newConversation = {
      id: Date.now(),
      title: "New Conversation",
      timestamp: new Date().toISOString(),
      messages: [],
    };
    setConversations(function (prev) {
      return [newConversation, ...prev];
    });
    setActiveConversationId(newConversation.id);
  }

  function handleSelectConversation(conversationId) {
    return function () {
      setActiveConversationId(conversationId);
    };
  }

  function handleDeleteConversation(conversationId) {
    setConversations(function (prev) {
      const filtered = prev.filter(function (c) {
        return c.id !== conversationId;
      });
      if (activeConversationId === conversationId && filtered.length > 0) {
        setActiveConversationId(filtered[0].id);
      }
      return filtered;
    });
    toast.success("Conversation deleted");
  }

  function handleSendMessage(content) {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setConversations(function (prev) {
      return prev.map(function (c) {
        if (c.id === activeConversationId) {
          const updatedMessages = [...c.messages, userMessage];
          const newTitle = c.messages.length === 0
            ? content.trim().slice(0, 30) + (content.trim().length > 30 ? "..." : "")
            : c.title;
          return {
            ...c,
            title: newTitle,
            messages: updatedMessages,
            timestamp: new Date().toISOString(),
          };
        }
        return c;
      });
    });

    setIsLoading(true);

    setTimeout(function () {
      const responses = [
        "That's a great question! Let me break this down for you step by step. First, consider the fundamentals - understanding the core concepts deeply will help you tackle advanced topics more confidently. Would you like me to elaborate on any specific area?",
        "Based on industry trends, I'd recommend focusing on three pillars: deepening your technical expertise, building visible projects, and networking strategically. Many developers underestimate the power of a strong professional network. Have you been attending meetups or contributing to open source?",
        "From my analysis of successful candidates, those who stand out typically demonstrate problem-solving ability rather than just listing technologies. Try to frame your experience around challenges you faced, the approach you took, and measurable outcomes. Do you have specific examples we could workshop?",
        "For interview preparation, I suggest the spaced repetition approach - review core concepts at increasing intervals. Start with data structures daily, then system design every 3 days, and behavioral stories weekly. This optimizes retention without burnout. Shall I create a custom study schedule for you?",
        "Salary negotiation is as much about psychology as numbers. Research shows anchoring high (within reason) leads to better outcomes. Always have a walk-away number prepared, and practice your delivery. The confidence in how you say it matters as much as what you say. Want to role-play a negotiation scenario?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: randomResponse,
        timestamp: new Date().toISOString(),
      };

      setConversations(function (prev) {
        return prev.map(function (c) {
          if (c.id === activeConversationId) {
            return {
              ...c,
              messages: [...c.messages, assistantMessage],
            };
          }
          return c;
        });
      });

      setIsLoading(false);
    }, 1500);
  }

  function handleSuggestionClick(suggestion) {
    return function () {
      handleSendMessage(suggestion);
    };
  }

  return (
    <React.Fragment>
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        {/* Sidebar */}
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onNewChat={handleNewChat}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-surface-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <FaRobot size={20} className="text-brand-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">{activeConversation ? activeConversation.title : "New Conversation"}</h2>
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeMessages.length === 0 ? (
              <EmptyState
                suggestions={SUGGESTION_CHIPS}
                onSuggestionClick={handleSuggestionClick}
              />
            ) : (
              <ChatContainer
                messages={activeMessages}
                isLoading={isLoading}
              />
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-surface-border shrink-0">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default AIMentorPage;