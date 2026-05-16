import { useState } from "react";
import {
  RiRobot2Line,
  RiSendPlaneLine,
  RiSparklingLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";

const SAMPLE_MESSAGES = [
  {
    role: "user",
    text: "How do I prepare for a system design interview?",
  },
  {
    role: "ai",
    text: "Great question! Here's a focused plan:\n\n1. Learn scalability fundamentals — load balancing, caching, CDNs\n2. Practice designing systems: URL shortener, Twitter feed, Uber\n3. Study real-world architectures (Netflix, WhatsApp)\n4. Focus on trade-offs: SQL vs NoSQL, consistency vs availability",
  },
  {
    role: "user",
    text: "What's the difference between SQL and NoSQL?",
  },
];

const AI_FEATURES = [
  "AI Interview Question Generator",
  "Personalized Roadmap Builder",
  "Resume ATS Scorer",
  "Mock Interview Simulator",
];

const AIShowcaseSection = () => {
  const [visibleCount, setVisibleCount] = useState(2);

  return (
    <section id="ai" className="py-24 px-4 relative overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/8 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Chat UI Mock ── */}
          <div className="card p-0 overflow-hidden border-brand-500/20">

            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border bg-surface-hover">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <RiRobot2Line className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">SkillMentor AI</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                  <span className="text-xs text-slate-400">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 flex flex-col gap-4 min-h-[280px]">
              {SAMPLE_MESSAGES.slice(0, visibleCount).map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 animate-fade-in ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.role === "ai"
                      ? "bg-brand-500 text-white"
                      : "bg-slate-600 text-white"
                  }`}>
                    {msg.role === "ai" ? "AI" : "U"}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "ai"
                      ? "bg-surface-hover text-slate-200 rounded-tl-none border border-surface-border"
                      : "bg-brand-500 text-white rounded-tr-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {visibleCount < SAMPLE_MESSAGES.length && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white">AI</div>
                  <div className="bg-surface-hover border border-surface-border rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map((d) => (
                      <div
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"
                        style={{ animationDelay: `${d * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="px-4 py-4 border-t border-surface-border flex gap-3">
              <input
                readOnly
                placeholder="Ask your AI mentor anything..."
                className="input text-sm py-2.5 flex-1"
                onClick={() => setVisibleCount((c) => Math.min(c + 1, SAMPLE_MESSAGES.length))}
              />
              <button
                className="btn-primary px-4 py-2.5"
                onClick={() => setVisibleCount((c) => Math.min(c + 1, SAMPLE_MESSAGES.length))}
              >
                <RiSendPlaneLine />
              </button>
            </div>
          </div>

          {/* ── Right: Text Content ── */}
          <div className="flex flex-col gap-6">
            <div className="badge badge-indigo w-fit">
              <RiSparklingLine />
              AI-Powered
            </div>

            <h2 className="section-title">
              Your Personal{" "}
              <span className="text-gradient">AI Career Coach</span>
              {" "}— Always On
            </h2>

            <p className="section-subtitle">
              SkillMentor AI understands where you are in your journey and
              gives you personalized guidance — from clearing doubts to
              generating interview questions tailored to your target role.
            </p>

            {/* AI Feature List */}
            <ul className="flex flex-col gap-3 mt-2">
              {AI_FEATURES.map((feat) => (
                <li key={feat} className="flex items-center gap-3">
                  <RiCheckboxCircleLine className="text-accent-400 text-xl flex-shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{feat}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-3 mt-2">
              <a href="/signup" className="btn-primary">
                Try AI Mentor Free
                <RiSparklingLine />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AIShowcaseSection;