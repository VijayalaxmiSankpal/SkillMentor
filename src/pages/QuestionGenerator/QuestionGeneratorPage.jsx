import React from "react";
import { useState, useMemo } from "react";
import { FaWandMagicSparkles, FaBookmark, FaTrash, FaCopy, FaCheck, FaHistory, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import RoleSelector from "./components/RoleSelector";
import TopicSelector from "./components/TopicSelector";
import GeneratedQuestion from "./components/GeneratedQuestion";
import SavedQuestions from "./components/SavedQuestions";
import GeneratorForm from "./components/GeneratorForm";

const PAGE_TITLE = "AI Question Generator";
const PAGE_SUBTITLE = "Generate custom interview questions tailored to your target role and topics";

const TAB_GENERATE = "generate";
const TAB_SAVED = "saved";

const ROLES = [
  { id: "frontend", name: "Frontend Developer", icon: "FaCode" },
  { id: "backend", name: "Backend Developer", icon: "FaServer" },
  { id: "fullstack", name: "Full Stack Developer", icon: "FaLayerGroup" },
  { id: "datascience", name: "Data Scientist", icon: "FaChartBar" },
  { id: "devops", name: "DevOps Engineer", icon: "FaCloud" },
  { id: "mobile", name: "Mobile Developer", icon: "FaMobileAlt" },
  { id: "system-design", name: "System Design", icon: "FaSitemap" },
];

const TOPICS = {
  frontend: ["React", "Vue", "Angular", "JavaScript", "TypeScript", "CSS", "Performance", "Accessibility", "Testing", "State Management"],
  backend: ["Node.js", "Python", "Java", "Go", "Databases", "API Design", "Authentication", "Caching", "Message Queues", "Microservices"],
  fullstack: ["React + Node", "Next.js", "MERN Stack", "Authentication", "Deployment", "Database Design", "REST vs GraphQL", "CI/CD"],
  datascience: ["Machine Learning", "Statistics", "Python", "SQL", "Data Visualization", "Feature Engineering", "Model Evaluation", "A/B Testing"],
  devops: ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Monitoring", "Linux", "Networking", "Security"],
  mobile: ["React Native", "Flutter", "iOS", "Android", "State Management", "Performance", "Push Notifications", "Offline Storage"],
  "system-design": ["Scalability", "Load Balancing", "Database Sharding", "Caching", "Microservices", "CAP Theorem", "Rate Limiting", "CDN"],
};

const MOCK_QUESTIONS = [
  {
    id: 1,
    roleId: "frontend",
    topic: "React",
    question: "Explain the difference between useEffect and useLayoutEffect. When would you use each?",
    answer: "useEffect runs asynchronously after render commits to screen. useLayoutEffect runs synchronously before browser paint. Use useLayoutEffect when you need to measure DOM or prevent visual flicker.",
    difficulty: "Medium",
    type: "Technical",
    saved: true,
    generatedAt: "2025-05-14T10:00:00",
  },
  {
    id: 2,
    roleId: "frontend",
    topic: "Performance",
    question: "How would you optimize a React application that has slow initial load time?",
    answer: "Code splitting with React.lazy and Suspense, lazy load images, optimize bundle size with tree shaking, use CDN for assets, implement server-side rendering, and use React.memo for expensive components.",
    difficulty: "Hard",
    type: "Technical",
    saved: true,
    generatedAt: "2025-05-14T10:05:00",
  },
  {
    id: 3,
    roleId: "backend",
    topic: "Databases",
    question: "Explain database indexing and when it can hurt performance.",
    answer: "Indexes speed up read queries by creating sorted data structures. However, they slow down writes (INSERT/UPDATE/DELETE) because indexes must be updated. Too many indexes on write-heavy tables can significantly degrade performance.",
    difficulty: "Medium",
    type: "Technical",
    saved: false,
    generatedAt: "2025-05-14T10:10:00",
  },
];

function QuestionGeneratorPage() {
  const [activeTab, setActiveTab] = useState(TAB_GENERATE);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState(MOCK_QUESTIONS.filter(function (q) { return q.saved; }));
  const [isGenerating, setIsGenerating] = useState(false);

  const availableTopics = useMemo(function () {
    if (!selectedRole) return [];
    return TOPICS[selectedRole.id] || [];
  }, [selectedRole]);

  function handleTabChange(tab) {
    return function () {
      setActiveTab(tab);
    };
  }

  function handleRoleSelect(role) {
    return function () {
      setSelectedRole(role);
      setSelectedTopics([]);
      setGeneratedQuestions([]);
    };
  }

  function handleTopicToggle(topic) {
    return function () {
      setSelectedTopics(function (prev) {
        if (prev.includes(topic)) {
          return prev.filter(function (t) { return t !== topic; });
        }
        return [...prev, topic];
      });
    };
  }

  function handleDifficultyChange(diff) {
    return function () {
      setDifficulty(diff);
    };
  }

  function handleCountChange(count) {
    return function () {
      setQuestionCount(count);
    };
  }

  function handleGenerate() {
    if (!selectedRole) {
      toast.error("Please select a role first");
      return;
    }
    if (selectedTopics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    setIsGenerating(true);

    setTimeout(function () {
      const templates = [
        "Explain {topic} and its use cases in {role}.",
        "What are the best practices for {topic} in a {role} role?",
        "Compare different approaches to {topic} for {role}.",
        "How would you debug a {topic} issue in a production {role} application?",
        "Design a {topic} solution for a large-scale {role} system.",
      ];

      const newQuestions = [];
      for (let i = 0; i < questionCount; i++) {
        const topic = selectedTopics[i % selectedTopics.length];
        const template = templates[Math.floor(Math.random() * templates.length)];
        const roleName = selectedRole.name;

        const questionText = template
          .replace("{topic}", topic)
          .replace("{role}", roleName);

        const answers = [
          "This is a sample AI-generated answer. In a real implementation, this would come from the Anthropic API via your backend. The answer would provide detailed technical explanation with examples.",
          "Another sample response. The actual integration would call your backend endpoint which forwards to Anthropic's Claude API with the appropriate prompt engineering for interview questions.",
          "Sample generated content. Replace this mock with actual API integration when your backend is ready.",
        ];

        newQuestions.push({
          id: Date.now() + i,
          roleId: selectedRole.id,
          topic: topic,
          question: questionText,
          answer: answers[i % answers.length],
          difficulty: difficulty,
          type: "Technical",
          saved: false,
          generatedAt: new Date().toISOString(),
        });
      }

      setGeneratedQuestions(newQuestions);
      setIsGenerating(false);
      toast.success("Generated " + newQuestions.length + " questions!");
    }, 2000);
  }

  function handleSaveQuestion(question) {
    return function () {
      setSavedQuestions(function (prev) {
        const exists = prev.find(function (q) { return q.id === question.id; });
        if (exists) {
          toast.info("Already saved!");
          return prev;
        }
        toast.success("Question saved!");
        return [...prev, { ...question, saved: true }];
      });

      setGeneratedQuestions(function (prev) {
        return prev.map(function (q) {
          if (q.id === question.id) {
            return { ...q, saved: true };
          }
          return q;
        });
      });
    };
  }

  function handleDeleteSaved(questionId) {
    setSavedQuestions(function (prev) {
      return prev.filter(function (q) { return q.id !== questionId; });
    });
    toast.success("Removed from saved");
  }

  function handleCopyQuestion(text) {
    return function () {
      navigator.clipboard.writeText(text).then(function () {
        toast.success("Copied to clipboard!");
      });
    };
  }

  const tabBase = "px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border";
  const tabActive = "bg-brand-500/20 text-brand-400 border-brand-500/30";
  const tabInactive = "text-gray-400 hover:text-white hover:bg-surface-card border-transparent";

  return (
    <React.Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">{PAGE_TITLE}</h1>
            <p className="text-gray-400 text-sm">{PAGE_SUBTITLE}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleTabChange(TAB_GENERATE)}
            className={tabBase + " " + (activeTab === TAB_GENERATE ? tabActive : tabInactive)}
          >
            <FaWandMagicSparkles size={14} />
            Generate
          </button>
          <button
            onClick={handleTabChange(TAB_SAVED)}
            className={tabBase + " " + (activeTab === TAB_SAVED ? tabActive : tabInactive)}
          >
            <FaBookmark size={14} />
            Saved
            <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
              {savedQuestions.length}
            </span>
          </button>
        </div>

        {/* Generate Tab */}
        {activeTab === TAB_GENERATE && (
          <React.Fragment>
            <GeneratorForm
              roles={ROLES}
              selectedRole={selectedRole}
              onRoleSelect={handleRoleSelect}
              availableTopics={availableTopics}
              selectedTopics={selectedTopics}
              onTopicToggle={handleTopicToggle}
              difficulty={difficulty}
              onDifficultyChange={handleDifficultyChange}
              questionCount={questionCount}
              onCountChange={handleCountChange}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />

            {generatedQuestions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-base">Generated Questions</h3>
                  <span className="text-gray-400 text-xs">{generatedQuestions.length} questions</span>
                </div>
                {generatedQuestions.map(function (question) {
                  return (
                    <GeneratedQuestion
                      key={question.id}
                      question={question}
                      onSave={handleSaveQuestion}
                      onCopy={handleCopyQuestion}
                    />
                  );
                })}
              </div>
            )}
          </React.Fragment>
        )}

        {/* Saved Tab */}
        {activeTab === TAB_SAVED && (
          <SavedQuestions
            questions={savedQuestions}
            onDelete={handleDeleteSaved}
            onCopy={handleCopyQuestion}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default QuestionGeneratorPage;