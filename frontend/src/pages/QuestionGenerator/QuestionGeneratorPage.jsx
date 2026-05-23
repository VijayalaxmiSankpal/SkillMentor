import React, { useEffect, useMemo, useState } from "react";
import { FaMagic, FaBookmark } from "react-icons/fa";
import toast from "react-hot-toast";
import GeneratedQuestion from "./components/GeneratedQuestion";
import SavedQuestions from "./components/SavedQuestions";
import GeneratorForm from "./components/GeneratorForm";
import aiService from "../../services/aiService";

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
  frontend: ["React", "JavaScript", "CSS", "Performance", "Testing"],
  backend: ["Node.js", "MongoDB", "REST APIs", "Authentication", "Databases"],
  fullstack: ["MERN Stack", "Authentication", "Deployment", "REST APIs"],
  datascience: ["Machine Learning", "Python", "SQL", "Statistics"],
  devops: ["Docker", "Kubernetes", "AWS", "CI/CD"],
  mobile: ["React Native", "Flutter", "Android", "iOS"],
  "system-design": ["Scalability", "Caching", "Load Balancing", "Microservices"],
};

function QuestionGeneratorPage() {
  const [activeTab, setActiveTab] = useState(TAB_GENERATE);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  useEffect(() => {
  loadSavedQuestions();
}, []);

const loadSavedQuestions = async () => {
  try {
    const response = await aiService.listSavedQuestions();

    const items =
      response.data?.data?.items || [];

    setSavedQuestions(items);
  } catch (error) {
    console.error(
      "Load saved questions failed:",
      error
    );
  }
};

  const availableTopics = useMemo(() => {
    if (!selectedRole) return [];
    return TOPICS[selectedRole.id] || [];
  }, [selectedRole]);

  const handleRoleSelect = (role) => () => {
    setSelectedRole(role);
    setSelectedTopics([]);
    setGeneratedQuestions([]);
  };

  const handleTopicToggle = (topic) => () => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.filter((t) => t !== topic);
      }
      return [...prev, topic];
    });
  };

  const handleGenerate = async () => {
    if (!selectedRole) {
      toast.error("Please select a role first");
      return;
    }

    if (selectedTopics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await aiService.generateInterviewQuestions({
  role: selectedRole.name,
  type: selectedRole.id === "system-design" ? "system-design" : "technical",
  difficulty: difficulty.toLowerCase(),
  skills: selectedTopics,
  count: questionCount,
});

      const questions = response.data?.data?.questions || [];

      const formattedQuestions = questions.map((q, index) => ({
        id: Date.now() + index,
        roleId: selectedRole.id,
        topic: q.expectedTopics?.[0] || selectedTopics[index % selectedTopics.length],
        question: q.question,
        answer: q.answer || "Answer not provided by AI.",
        difficulty: q.difficulty || difficulty,
        type: q.category || "Technical",
        saved: false,
        generatedAt: new Date().toISOString(),
      }));

      setGeneratedQuestions(formattedQuestions);
      toast.success(`Generated ${formattedQuestions.length} questions!`);
    } catch (error) {
      console.error("Question generation failed:", error);
      toast.error(error?.response?.data?.message || "Failed to generate questions");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuestion = (question) => async () => {
  try {
    const response = await aiService.saveQuestion({
      role: selectedRole?.name || question.roleId || "Interview",
      topic: question.topic,
      question: question.question,
      answer: question.answer,
      difficulty: question.difficulty,
      type: question.type,
    });

    const saved = response.data?.data?.question;

    setSavedQuestions((prev) => [saved, ...prev]);

    setGeneratedQuestions((prev) =>
      prev.map((q) =>
        q.id === question.id ? { ...q, saved: true } : q
      )
    );

    toast.success("Question saved!");
  } catch (error) {
    console.error("Save question failed:", error);
    toast.error(error?.response?.data?.message || "Failed to save question");
  }
};

  const handleDeleteSaved = async (questionId) => {
  try {
    await aiService.deleteSavedQuestion(questionId);

    setSavedQuestions((prev) =>
      prev.filter(
        (q) =>
          q._id !== questionId &&
          q.id !== questionId
      )
    );

    toast.success("Removed from saved");
  } catch (error) {
    console.error(
      "Delete saved question failed:",
      error
    );

    toast.error("Failed to remove question");
  }
};

  const handleCopyQuestion = (text) => () => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  const tabBase =
    "px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border";
  const tabActive = "bg-brand-500/20 text-brand-400 border-brand-500/30";
  const tabInactive =
    "text-gray-400 hover:text-white hover:bg-surface-card border-transparent";

  return (
    <React.Fragment>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">
              AI Question Generator
            </h1>
            <p className="text-gray-400 text-sm">
              Generate custom interview questions tailored to your target role and topics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab(TAB_GENERATE)}
            className={
              tabBase + " " + (activeTab === TAB_GENERATE ? tabActive : tabInactive)
            }
          >
            <FaMagic size={14} />
            Generate
          </button>

          <button
            onClick={() => setActiveTab(TAB_SAVED)}
            className={
              tabBase + " " + (activeTab === TAB_SAVED ? tabActive : tabInactive)
            }
          >
            <FaBookmark size={14} />
            Saved
            <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
              {savedQuestions.length}
            </span>
          </button>
        </div>

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
              onDifficultyChange={(diff) => () => setDifficulty(diff)}
              questionCount={questionCount}
              onCountChange={(count) => () => setQuestionCount(count)}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />

            {generatedQuestions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-base">
                    Generated Questions
                  </h3>
                  <span className="text-gray-400 text-xs">
                    {generatedQuestions.length} questions
                  </span>
                </div>

                {generatedQuestions.map((question) => (
                  <GeneratedQuestion
                    key={question.id}
                    question={question}
                    onSave={handleSaveQuestion}
                    onCopy={handleCopyQuestion}
                  />
                ))}
              </div>
            )}
          </React.Fragment>
        )}

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