import React, { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaBrain,
  FaBookOpen,
  FaRedo,
  FaChartLine,
  FaPlus,
  FaMagic,
  FaSave,
} from "react-icons/fa";
import toast from "react-hot-toast";
import TopicCard from "./components/TopicCard";
import TopicProgress from "./components/TopicProgress";
import QuestionList from "./components/QuestionList";
import QuestionModal from "./components/QuestionModal";
import WeakTopics from "./components/WeakTopics";
import RevisionSection from "./components/RevisionSection";
import interviewService from "../../services/interviewService";

const TAB_TOPICS = "topics";
const TAB_QUESTIONS = "questions";
const TAB_REVISION = "revision";

const SUBJECTS = [
  {
    id: "frontend",
    name: "Frontend Development",
    description: "HTML, CSS, JavaScript, React, UI concepts",
    color: "brand",
  },
  {
    id: "backend",
    name: "Backend Development",
    description: "Node.js, Express, MongoDB, APIs, Auth",
    color: "emerald",
  },
  {
    id: "fullstack",
    name: "Full Stack Development",
    description: "Frontend + Backend + Database integration",
    color: "purple",
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    description: "Arrays, Strings, Trees, Graphs, DP",
    color: "brand",
  },
  {
    id: "dbms",
    name: "Database Management",
    description: "SQL, Normalization, Transactions, Indexing",
    color: "emerald",
  },
  {
    id: "os",
    name: "Operating Systems",
    description: "Processes, Threads, Memory, Deadlocks",
    color: "amber",
  },
  {
    id: "cn",
    name: "Computer Networks",
    description: "OSI, TCP/IP, HTTP, DNS, Routing",
    color: "rose",
  },
  {
    id: "system-design",
    name: "System Design",
    description: "Scalability, Caching, Load Balancing",
    color: "purple",
  },
  {
    id: "aptitude",
    name: "Aptitude & Reasoning",
    description: "Quant, Logical, Verbal, Puzzles",
    color: "orange",
  },
  {
    id: "hr",
    name: "HR & Behavioral",
    description: "Self intro, strengths, scenarios",
    color: "pink",
  },
];

const confidenceToDifficulty = (confidence) => {
  if (confidence <= 2) return "Hard";
  if (confidence === 3) return "Medium";
  return "Easy";
};

const difficultyToConfidence = (difficulty) => {
  if (difficulty === "Hard") return 2;
  if (difficulty === "Medium") return 3;
  return 4;
};

const subjectToSkill = (subjectId) => {
  const map = {
    frontend: "Frontend Development",
    backend: "Backend Development",
    fullstack: "Full Stack Development",
    dsa: "Data Structures and Algorithms",
    dbms: "Database Management System",
    os: "Operating Systems",
    cn: "Computer Networks",
    "system-design": "System Design",
    aptitude: "Aptitude and Reasoning",
    hr: "HR Interview",
  };

  return map[subjectId] || "Interview Preparation";
};

function InterviewPrepPage() {
  const [preps, setPreps] = useState([]);
  const [activeTab, setActiveTab] = useState(TAB_TOPICS);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const loadPrep = async () => {
    try {
      setLoading(true);
      const response = await interviewService.getAllPrep();
      const data = response.data?.data || response.data;
      setPreps(data.preps || []);
    } catch (error) {
      console.error("Interview prep load failed:", error);
      toast.error("Failed to load interview prep");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrep();
  }, []);

  const topics = useMemo(() => {
    return SUBJECTS.map((subject) => {
      const prep = preps.find((p) => p.subject === subject.id);
      const subjectTopics = prep?.topics || [];
      const completed = subjectTopics.filter((t) => t.confidence >= 4).length;
      const weakAreas = subjectTopics
        .filter((t) => t.confidence <= 2)
        .map((t) => t.name);

      return {
        ...subject,
        totalQuestions: subjectTopics.length,
        completedQuestions: completed,
        weakAreas,
      };
    });
  }, [preps]);

  const questions = useMemo(() => {
    return preps.flatMap((prep) =>
      (prep.topics || []).map((topic) => ({
        id: topic._id,
        topicId: prep.subject,
        question: topic.name,
        answer: topic.notes || "Add notes for this topic.",
        difficulty: confidenceToDifficulty(topic.confidence),
        status: topic.confidence >= 4 ? "completed" : "incomplete",
        bookmarked: topic.isWeak,
        revisionDate: null,
        timesRevised: topic.confidence >= 4 ? 1 : 0,
        lastRevised: topic.lastRevisedAt
          ? new Date(topic.lastRevisedAt).toISOString().split("T")[0]
          : null,
        confidence: topic.confidence,
      }))
    );
  }, [preps]);

  const overallProgress = useMemo(() => {
    const total = questions.length;
    const completed = questions.filter((q) => q.status === "completed").length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [questions]);

  const weakTopicsList = useMemo(() => {
    return topics.filter(
      (t) => t.weakAreas.length > 0 || t.completedQuestions < t.totalQuestions
    );
  }, [topics]);

  const revisionQuestions = useMemo(() => {
    return questions.filter((q) => q.status === "completed" || q.confidence <= 2);
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTopic = selectedTopicId === null || q.topicId === selectedTopicId;
      const matchesDifficulty =
        difficultyFilter === "all" || q.difficulty === difficultyFilter;
      const matchesStatus = statusFilter === "all" || q.status === statusFilter;

      return matchesSearch && matchesTopic && matchesDifficulty && matchesStatus;
    });
  }, [questions, searchQuery, selectedTopicId, difficultyFilter, statusFilter]);

  const selectedTopic = useMemo(() => {
    if (!selectedTopicId) return null;
    return topics.find((t) => t.id === selectedTopicId);
  }, [topics, selectedTopicId]);

  const handleTabChange = (tab) => () => {
    setActiveTab(tab);
    if (tab !== TAB_QUESTIONS) {
      setSelectedTopicId(null);
    }
  };

  const handleTopicClick = (topicId) => () => {
    setSelectedTopicId(topicId);
    setActiveTab(TAB_QUESTIONS);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionModal(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    try {
      await interviewService.deleteTopic(question.topicId, question.id);
      toast.success("Question deleted!");
      await loadPrep();
    } catch (error) {
      console.error("Delete question failed:", error);
      toast.error("Failed to delete question");
    }
  };

  const handleToggleStatus = async (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const nextConfidence = question.status === "completed" ? 2 : 5;

    try {
      await interviewService.updateTopic(question.topicId, question.id, {
        name: question.question,
        notes: question.answer,
        confidence: nextConfidence,
      });

      toast.success("Progress updated!");
      await loadPrep();
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update progress");
    }
  };

  const handleToggleBookmark = async (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const nextConfidence = question.confidence <= 2 ? 3 : 2;

    try {
      await interviewService.updateTopic(question.topicId, question.id, {
        name: question.question,
        notes: question.answer,
        confidence: nextConfidence,
      });

      toast.success(
        nextConfidence <= 2 ? "Marked as weak topic" : "Removed from weak topics"
      );

      await loadPrep();
    } catch (error) {
      console.error("Weak topic update failed:", error);
      toast.error("Failed to update topic");
    }
  };

  const handleSaveQuestion = async (questionData) => {
    const subject = questionData.topicId || selectedTopicId || "dsa";

    const payload = {
      name: (questionData.question || "").slice(0, 95),
      notes: (questionData.answer || "").slice(0, 950),
      confidence:
        questionData.status === "completed"
          ? 5
          : difficultyToConfidence(questionData.difficulty),
    };

    try {
      if (editingQuestion && editingQuestion.id) {
        await interviewService.updateTopic(
          editingQuestion.topicId,
          editingQuestion.id,
          payload
        );

        toast.success("Question updated!");
      } else {
        await interviewService.addTopic(subject, payload);
        toast.success("Question saved!");
      }

      setShowQuestionModal(false);
      setEditingQuestion(null);
      await loadPrep();
    } catch (error) {
      console.error("Save question failed:", error);
      toast.error(error?.response?.data?.message || "Failed to save question");
    }
  };

  const handleSaveGeneratedQuestion = async (question) => {
    await handleSaveQuestion(question);

    setGeneratedQuestions((prev) =>
      prev.filter((item) => item.id !== question.id)
    );
  };

  const handleSaveAllGeneratedQuestions = async () => {
    if (generatedQuestions.length === 0) {
      toast.error("No generated questions to save");
      return;
    }

    try {
      for (const question of generatedQuestions) {
        const subject = question.topicId || selectedTopicId || "dsa";

        await interviewService.addTopic(subject, {
          name: (question.question || "").slice(0, 95),
          notes: (question.answer || "").slice(0, 950),
          confidence: difficultyToConfidence(question.difficulty),
        });
      }

      toast.success("All generated questions saved!");
      setGeneratedQuestions([]);
      await loadPrep();
    } catch (error) {
      console.error("Save all generated questions failed:", error);
      toast.error(error?.response?.data?.message || "Failed to save questions");
    }
  };

  const handleMarkRevised = async (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    try {
      await interviewService.updateTopic(question.topicId, question.id, {
        name: question.question,
        notes: question.answer,
        confidence: Math.min((question.confidence || 3) + 1, 5),
      });

      toast.success("Marked as revised!");
      await loadPrep();
    } catch (error) {
      console.error("Revision update failed:", error);
      toast.error("Failed to mark revised");
    }
  };

  const handleGeneratedAnswerChange = (questionId, value) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, userAnswer: value } : q
      )
    );
  };

  const handleEvaluateGeneratedAnswer = async (question) => {
    if (!question.userAnswer || !question.userAnswer.trim()) {
      toast.error("Please write your answer first");
      return;
    }

    try {
      setGeneratedQuestions((prev) =>
        prev.map((q) =>
          q.id === question.id ? { ...q, evaluating: true } : q
        )
      );

      const response = await interviewService.evaluateAnswer({
        question: question.question,
        userAnswer: question.userAnswer,
        idealAnswer: question.answer,
      });

      const data = response.data?.data || response.data;

      setGeneratedQuestions((prev) =>
        prev.map((q) =>
          q.id === question.id
            ? { ...q, evaluation: data, evaluating: false }
            : q
        )
      );

      toast.success("Answer evaluated!");
    } catch (error) {
      console.error("Answer evaluation failed:", error);
      toast.error(error?.response?.data?.message || "Evaluation failed");

      setGeneratedQuestions((prev) =>
        prev.map((q) =>
          q.id === question.id ? { ...q, evaluating: false } : q
        )
      );
    }
  };

  const handleGenerateAIQuestion = async () => {
    try {
      setGeneratingAI(true);

      const subject = selectedTopicId || "frontend";
      const skill = subjectToSkill(subject);

      const response = await interviewService.generateAIQuestions({
        role:
          subject === "backend"
            ? "Backend Developer"
            : subject === "fullstack"
            ? "Full Stack Developer"
            : "Frontend Developer",
        type: subject === "system-design" ? "system-design" : "technical",
        difficulty:
          difficultyFilter !== "all" ? difficultyFilter.toLowerCase() : "medium",
        skills: [skill],
        count: questionCount,
      });

      const data = response.data?.data || response.data;
      const aiQuestions = data.questions || [];

      if (!aiQuestions.length) {
        toast.error("AI did not return questions");
        return;
      }

      const formattedQuestions = aiQuestions.map((q, index) => ({
        id: Date.now() + index,
        topicId: subject,
        question: q.question || "",
        answer:
          q.answer ||
          q.expectedAnswer ||
          q.explanation ||
          q.sampleAnswer ||
          q.modelAnswer ||
          q.idealAnswer ||
          "AI generated this question, but did not return an answer.",
        showAnswer: false,
        userAnswer: "",
        evaluation: null,
        evaluating: false,
        difficulty: difficultyFilter !== "all" ? difficultyFilter : "Medium",
        bookmarked: false,
      }));

      setGeneratedQuestions(formattedQuestions);
      setActiveTab(TAB_QUESTIONS);

      toast.success(`${formattedQuestions.length} AI questions generated!`);
    } catch (error) {
      console.error("AI question generation failed:", error);
      toast.error(error?.response?.data?.message || "AI generation failed");
    } finally {
      setGeneratingAI(false);
    }
  };

  const tabBase =
    "px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border";
  const tabActive = "bg-brand-500/20 text-brand-400 border-brand-500/30";
  const tabInactive =
    "text-gray-400 hover:text-white hover:bg-surface-card border-transparent";

  const filterBtnBase =
    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border";
  const filterBtnActive = "bg-brand-500 text-white border-brand-500";
  const filterBtnInactive =
    "bg-surface-card text-gray-400 border-surface-border hover:border-gray-500";

  return (
    <React.Fragment>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">
              Interview Preparation
            </h1>

            <p className="text-gray-400 text-sm">
              Generate multiple questions, save them, revise weak areas, and track your preparation.
            </p>
          </div>

          <div className="card px-4 py-2 flex items-center gap-3">
            <FaChartLine size={18} className="text-brand-400" />
            <div>
              <p className="text-xs text-gray-400">Overall Progress</p>
              <p className="text-lg font-bold text-white">{overallProgress}%</p>
            </div>
          </div>
        </div>

        <TopicProgress topics={topics} />

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleTabChange(TAB_TOPICS)}
            className={
              tabBase + " " + (activeTab === TAB_TOPICS ? tabActive : tabInactive)
            }
          >
            <FaBookOpen size={14} />
            Topics
          </button>

          <button
            onClick={handleTabChange(TAB_QUESTIONS)}
            className={
              tabBase +
              " " +
              (activeTab === TAB_QUESTIONS ? tabActive : tabInactive)
            }
          >
            <FaBrain size={14} />
            Questions
            <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
              {questions.length}
            </span>
          </button>

          <button
            onClick={handleTabChange(TAB_REVISION)}
            className={
              tabBase +
              " " +
              (activeTab === TAB_REVISION ? tabActive : tabInactive)
            }
          >
            <FaRedo size={14} />
            Revision
            <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
              {revisionQuestions.length}
            </span>
          </button>
        </div>

        {loading ? (
          <div className="card p-12 text-center text-gray-400">
            Loading interview preparation...
          </div>
        ) : activeTab === TAB_TOPICS ? (
          <React.Fragment>
            <WeakTopics topics={weakTopicsList} onTopicClick={handleTopicClick} />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onClick={handleTopicClick(topic.id)}
                />
              ))}
            </div>
          </React.Fragment>
        ) : activeTab === TAB_QUESTIONS ? (
          <React.Fragment>
            <div className="card p-4 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />

                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface border border-surface-border rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {["all", "Easy", "Medium", "Hard"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setDifficultyFilter(filter)}
                      className={
                        filterBtnBase +
                        " " +
                        (difficultyFilter === filter
                          ? filterBtnActive
                          : filterBtnInactive)
                      }
                    >
                      {filter === "all" ? "All" : filter}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {["all", "completed", "incomplete"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={
                        filterBtnBase +
                        " " +
                        (statusFilter === filter
                          ? filterBtnActive
                          : filterBtnInactive)
                      }
                    >
                      {filter === "all"
                        ? "All Status"
                        : filter === "completed"
                        ? "Strong"
                        : "Needs Practice"}
                    </button>
                  ))}
                </div>
              </div>

              {selectedTopic && (
                <div className="flex items-center gap-2 pt-2 border-t border-surface-border">
                  <span className="text-sm text-gray-400">Viewing:</span>

                  <span className="badge-indigo text-xs px-2.5 py-1">
                    {selectedTopic.name}
                  </span>

                  <button
                    onClick={() => setSelectedTopicId(null)}
                    className="text-xs text-brand-400 hover:text-brand-300 ml-2"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>

            <div className="card p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedTopicId || "frontend"}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="bg-surface border border-surface-border rounded-xl px-3 py-2 text-white text-sm"
                >
                  {SUBJECTS.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>

                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="bg-surface border border-surface-border rounded-xl px-3 py-2 text-white text-sm"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleGenerateAIQuestion}
                  disabled={generatingAI}
                  className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-60"
                >
                  <FaMagic size={12} />
                  {generatingAI ? "Generating..." : "Generate Questions"}
                </button>

                <button
                  onClick={handleAddQuestion}
                  className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                >
                  <FaPlus size={12} />
                  Add Question
                </button>
              </div>
            </div>

            {generatedQuestions.length > 0 && (
              <div className="card p-5 border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">
                      Generated Questions
                    </h3>

                    <p className="text-slate-400 text-xs mt-1">
                      Write your answer, evaluate it, then reveal the AI answer if needed.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveAllGeneratedQuestions}
                    className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                  >
                    <FaSave size={12} />
                    Save All
                  </button>
                </div>

                <div className="space-y-3">
                  {generatedQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="bg-surface/60 border border-surface-border rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">
                            Q{index + 1}. {question.question}
                          </p>

                          <textarea
                            value={question.userAnswer}
                            onChange={(e) =>
                              handleGeneratedAnswerChange(question.id, e.target.value)
                            }
                            placeholder="Write your answer here..."
                            className="w-full mt-3 bg-surface border border-surface-border rounded-xl p-3 text-white text-sm"
                            rows={4}
                          />

                          <button
                            onClick={() => handleEvaluateGeneratedAnswer(question)}
                            disabled={question.evaluating}
                            className="mt-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-lg text-xs"
                          >
                            {question.evaluating ? "Evaluating..." : "Evaluate Answer"}
                          </button>

                          {question.evaluation && (
                            <div className="mt-4 p-3 rounded-xl border border-brand-500/20 bg-brand-500/5">
                              <p className="text-white font-semibold">
                                Score: {question.evaluation.score}/10
                              </p>

                              <p className="text-slate-300 mt-2 text-sm">
                                {question.evaluation.feedback}
                              </p>

                              {question.evaluation.strengths?.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-emerald-400 text-sm font-medium">
                                    Strengths
                                  </p>

                                  <ul className="list-disc ml-5 text-slate-300 text-sm">
                                    {question.evaluation.strengths.map((item, i) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {question.evaluation.missingPoints?.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-rose-400 text-sm font-medium">
                                    Missing Points
                                  </p>

                                  <ul className="list-disc ml-5 text-slate-300 text-sm">
                                    {question.evaluation.missingPoints.map((item, i) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {question.showAnswer ? (
                            <p className="text-slate-400 text-xs mt-3">
                              {question.answer}
                            </p>
                          ) : (
                            <button
                              onClick={() => {
                                setGeneratedQuestions((prev) =>
                                  prev.map((q) =>
                                    q.id === question.id
                                      ? { ...q, showAnswer: true }
                                      : q
                                  )
                                );
                              }}
                              className="text-brand-400 text-xs mt-3 hover:text-brand-300"
                            >
                              Show AI Answer
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => handleSaveGeneratedQuestion(question)}
                          className="bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 px-3 py-1.5 rounded-lg text-xs"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <QuestionList
              questions={filteredQuestions}
              topics={topics}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              onToggleStatus={handleToggleStatus}
              onToggleBookmark={handleToggleBookmark}
            />
          </React.Fragment>
        ) : (
          <RevisionSection
            questions={revisionQuestions}
            topics={topics}
            onMarkRevised={handleMarkRevised}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
      </div>

      {showQuestionModal && (
        <QuestionModal
          question={editingQuestion}
          topics={topics}
          onClose={() => {
            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
          onSave={handleSaveQuestion}
          onGenerateAI={handleGenerateAIQuestion}
        />
      )}
    </React.Fragment>
  );
}

export default InterviewPrepPage;