import React from "react";
import { useState, useMemo } from "react";
import { FaSearch, FaBrain, FaBookOpen, FaRedo, FaChartLine, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import TopicCard from "./components/TopicCard";
import TopicProgress from "./components/TopicProgress";
import QuestionList from "./components/QuestionList";
import QuestionModal from "./components/QuestionModal";
import WeakTopics from "./components/WeakTopics";
import RevisionSection from "./components/RevisionSection";

const PAGE_TITLE = "Interview Preparation";
const PAGE_SUBTITLE = "Master DSA, System Design, CS Fundamentals and track your interview readiness";

const SEARCH_PLACEHOLDER = "Search questions across all topics...";
const TAB_TOPICS = "topics";
const TAB_QUESTIONS = "questions";
const TAB_REVISION = "revision";

const INITIAL_TOPICS = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    icon: "FaCode",
    description: "Arrays, Strings, Linked Lists, Trees, Graphs, DP, Greedy, etc.",
    totalQuestions: 150,
    completedQuestions: 89,
    weakAreas: ["Dynamic Programming", "Graph Algorithms"],
    color: "brand",
  },
  {
    id: "dbms",
    name: "Database Management",
    icon: "FaDatabase",
    description: "SQL, Normalization, Indexing, Transactions, ACID, NoSQL",
    totalQuestions: 80,
    completedQuestions: 45,
    weakAreas: ["Normalization", "Indexing Strategies"],
    color: "emerald",
  },
  {
    id: "os",
    name: "Operating Systems",
    icon: "FaDesktop",
    description: "Processes, Threads, Memory Management, Scheduling, Deadlocks",
    totalQuestions: 70,
    completedQuestions: 38,
    weakAreas: ["Memory Management", "Deadlock Handling"],
    color: "amber",
  },
  {
    id: "cn",
    name: "Computer Networks",
    icon: "FaNetworkWired",
    description: "OSI Model, TCP/IP, HTTP, DNS, Routing, Subnetting",
    totalQuestions: 65,
    completedQuestions: 30,
    weakAreas: ["TCP/IP Handshake", "Subnetting"],
    color: "rose",
  },
  {
    id: "system-design",
    name: "System Design",
    icon: "FaSitemap",
    description: "Scalability, Load Balancing, Caching, Microservices, CAP Theorem",
    totalQuestions: 50,
    completedQuestions: 22,
    weakAreas: ["Microservices", "Database Sharding"],
    color: "purple",
  },
  {
    id: "oops",
    name: "OOP & Design Patterns",
    icon: "FaCube",
    description: "Encapsulation, Inheritance, Polymorphism, SOLID, Patterns",
    totalQuestions: 45,
    completedQuestions: 35,
    weakAreas: ["Design Patterns"],
    color: "cyan",
  },
  {
    id: "aptitude",
    name: "Aptitude & Reasoning",
    icon: "FaCalculator",
    description: "Quantitative, Logical, Verbal, Puzzles",
    totalQuestions: 100,
    completedQuestions: 60,
    weakAreas: ["Probability", "Permutations"],
    color: "orange",
  },
  {
    id: "hr",
    name: "HR & Behavioral",
    icon: "FaUserTie",
    description: "Tell me about yourself, Strengths/Weaknesses, Situational",
    totalQuestions: 40,
    completedQuestions: 25,
    weakAreas: ["Conflict Resolution"],
    color: "pink",
  },
];

const INITIAL_QUESTIONS = [
  {
    id: 1,
    topicId: "dsa",
    question: "What is the time complexity of binary search?",
    answer: "O(log n) - Binary search divides the search interval in half each time.",
    difficulty: "Easy",
    status: "completed",
    bookmarked: false,
    revisionDate: null,
    timesRevised: 2,
    lastRevised: "2025-05-10",
  },
  {
    id: 2,
    topicId: "dsa",
    question: "Explain the difference between BFS and DFS.",
    answer: "BFS explores level by level using a queue. DFS explores as deep as possible using a stack/recursion.",
    difficulty: "Medium",
    status: "completed",
    bookmarked: true,
    revisionDate: "2025-05-16",
    timesRevised: 1,
    lastRevised: "2025-05-09",
  },
  {
    id: 3,
    topicId: "dsa",
    question: "What is dynamic programming and when should it be used?",
    answer: "DP is an optimization technique for problems with overlapping subproblems and optimal substructure.",
    difficulty: "Hard",
    status: "incomplete",
    bookmarked: true,
    revisionDate: null,
    timesRevised: 0,
    lastRevised: null,
  },
  {
    id: 4,
    topicId: "dbms",
    question: "What are ACID properties in a database?",
    answer: "Atomicity, Consistency, Isolation, Durability - guarantees reliable processing of transactions.",
    difficulty: "Easy",
    status: "completed",
    bookmarked: false,
    revisionDate: null,
    timesRevised: 3,
    lastRevised: "2025-05-11",
  },
  {
    id: 5,
    topicId: "dbms",
    question: "Explain the different types of database indexes.",
    answer: "B-Tree, Hash, Bitmap, GiST, GIN indexes. Each suited for different query patterns.",
    difficulty: "Medium",
    status: "incomplete",
    bookmarked: false,
    revisionDate: null,
    timesRevised: 0,
    lastRevised: null,
  },
  {
    id: 6,
    topicId: "os",
    question: "What is the difference between a process and a thread?",
    answer: "A process is an independent execution unit with its own memory space. Threads share memory within a process.",
    difficulty: "Easy",
    status: "completed",
    bookmarked: true,
    revisionDate: "2025-05-15",
    timesRevised: 2,
    lastRevised: "2025-05-08",
  },
  {
    id: 7,
    topicId: "os",
    question: "Explain deadlock and methods to prevent it.",
    answer: "Deadlock occurs when processes wait for each other indefinitely. Prevention: avoid circular wait, hold and wait, etc.",
    difficulty: "Hard",
    status: "incomplete",
    bookmarked: true,
    revisionDate: null,
    timesRevised: 0,
    lastRevised: null,
  },
  {
    id: 8,
    topicId: "cn",
    question: "Explain the OSI model and its 7 layers.",
    answer: "Physical, Data Link, Network, Transport, Session, Presentation, Application - each with specific functions.",
    difficulty: "Medium",
    status: "completed",
    bookmarked: false,
    revisionDate: null,
    timesRevised: 1,
    lastRevised: "2025-05-07",
  },
  {
    id: 9,
    topicId: "system-design",
    question: "How would you design a URL shortener like bit.ly?",
    answer: "Use hash function or base62 encoding, store in DB, handle collisions, scale with caching and load balancing.",
    difficulty: "Hard",
    status: "incomplete",
    bookmarked: true,
    revisionDate: null,
    timesRevised: 0,
    lastRevised: null,
  },
  {
    id: 10,
    topicId: "oops",
    question: "Explain the SOLID principles.",
    answer: "Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion.",
    difficulty: "Medium",
    status: "completed",
    bookmarked: false,
    revisionDate: "2025-05-14",
    timesRevised: 2,
    lastRevised: "2025-05-12",
  },
  {
    id: 11,
    topicId: "aptitude",
    question: "Two trains are moving towards each other at 60km/h and 40km/h...",
    answer: "Relative speed = 100km/h. Time = Distance / Relative Speed.",
    difficulty: "Easy",
    status: "completed",
    bookmarked: false,
    revisionDate: null,
    timesRevised: 1,
    lastRevised: "2025-05-06",
  },
  {
    id: 12,
    topicId: "hr",
    question: "Tell me about yourself.",
    answer: "Prepare a 2-minute pitch covering background, skills, achievements, and why this role.",
    difficulty: "Easy",
    status: "completed",
    bookmarked: true,
    revisionDate: "2025-05-13",
    timesRevised: 4,
    lastRevised: "2025-05-09",
  },
];

function InterviewPrepPage() {
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [activeTab, setActiveTab] = useState(TAB_TOPICS);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const overallProgress = useMemo(function () {
    const total = topics.reduce(function (sum, t) {
      return sum + t.totalQuestions;
    }, 0);
    const completed = topics.reduce(function (sum, t) {
      return sum + t.completedQuestions;
    }, 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [topics]);

  const weakTopicsList = useMemo(function () {
    return topics.filter(function (t) {
      const progress = t.totalQuestions > 0 ? (t.completedQuestions / t.totalQuestions) * 100 : 0;
      return progress < 50;
    });
  }, [topics]);

  const revisionQuestions = useMemo(function () {
    const today = new Date().toISOString().split("T")[0];
    return questions.filter(function (q) {
      if (q.revisionDate && q.revisionDate <= today) {
        return true;
      }
      if (q.status === "completed" && q.timesRevised < 3 && !q.revisionDate) {
        return true;
      }
      return false;
    });
  }, [questions]);

  const filteredQuestions = useMemo(function () {
    return questions.filter(function (q) {
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTopic = selectedTopicId === null || q.topicId === selectedTopicId;
      const matchesDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter;
      const matchesStatus = statusFilter === "all" || q.status === statusFilter;
      return matchesSearch && matchesTopic && matchesDifficulty && matchesStatus;
    });
  }, [questions, searchQuery, selectedTopicId, difficultyFilter, statusFilter]);

  const selectedTopic = useMemo(function () {
    if (!selectedTopicId) return null;
    return topics.find(function (t) {
      return t.id === selectedTopicId;
    });
  }, [topics, selectedTopicId]);

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
  }

  function handleTabChange(tab) {
    return function () {
      setActiveTab(tab);
      if (tab !== TAB_QUESTIONS) {
        setSelectedTopicId(null);
      }
    };
  }

  function handleTopicClick(topicId) {
    return function () {
      setSelectedTopicId(topicId);
      setActiveTab(TAB_QUESTIONS);
    };
  }

  function handleAddQuestion() {
    setEditingQuestion(null);
    setShowQuestionModal(true);
  }

  function handleEditQuestion(question) {
    setEditingQuestion(question);
    setShowQuestionModal(true);
  }

  function handleDeleteQuestion(questionId) {
    setQuestions(function (prev) {
      return prev.filter(function (q) {
        return q.id !== questionId;
      });
    });
    toast.success("Question deleted!");
  }

  function handleToggleStatus(questionId) {
    setQuestions(function (prev) {
      return prev.map(function (q) {
        if (q.id === questionId) {
          const newStatus = q.status === "completed" ? "incomplete" : "completed";
          return {
            ...q,
            status: newStatus,
            lastRevised: newStatus === "completed" ? new Date().toISOString().split("T")[0] : q.lastRevised,
            timesRevised: newStatus === "completed" ? q.timesRevised + 1 : q.timesRevised,
          };
        }
        return q;
      });
    });
  }

  function handleToggleBookmark(questionId) {
    setQuestions(function (prev) {
      return prev.map(function (q) {
        if (q.id === questionId) {
          return { ...q, bookmarked: !q.bookmarked };
        }
        return q;
      });
    });
  }

  function handleSaveQuestion(questionData) {
    if (editingQuestion) {
      setQuestions(function (prev) {
        return prev.map(function (q) {
          if (q.id === editingQuestion.id) {
            return { ...q, ...questionData };
          }
          return q;
        });
      });
      toast.success("Question updated!");
    } else {
      const newQuestion = {
        id: Date.now(),
        ...questionData,
        status: "incomplete",
        timesRevised: 0,
        lastRevised: null,
        revisionDate: null,
      };
      setQuestions(function (prev) {
        return [...prev, newQuestion];
      });
      toast.success("Question added!");
    }
    setShowQuestionModal(false);
    setEditingQuestion(null);
  }

  function handleModalClose() {
    setShowQuestionModal(false);
    setEditingQuestion(null);
  }

  function handleMarkRevised(questionId) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const revisionDate = nextWeek.toISOString().split("T")[0];

    setQuestions(function (prev) {
      return prev.map(function (q) {
        if (q.id === questionId) {
          return {
            ...q,
            timesRevised: q.timesRevised + 1,
            lastRevised: new Date().toISOString().split("T")[0],
            revisionDate: revisionDate,
          };
        }
        return q;
      });
    });
    toast.success("Marked as revised! Next revision scheduled.");
  }

  function handleDifficultyFilterChange(filter) {
    return function () {
      setDifficultyFilter(filter);
    };
  }

  function handleStatusFilterChange(filter) {
    return function () {
      setStatusFilter(filter);
    };
  }

  function handleBackToTopics() {
    setSelectedTopicId(null);
  }

  const tabBase = "px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border";
  const tabActive = "bg-brand-500/20 text-brand-400 border-brand-500/30";
  const tabInactive = "text-gray-400 hover:text-white hover:bg-surface-card border-transparent";

  const filterBtnBase = "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border";
  const filterBtnActive = "bg-brand-500 text-white border-brand-500";
  const filterBtnInactive = "bg-surface-card text-gray-400 border-surface-border hover:border-gray-500";

  return (
    <React.Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">{PAGE_TITLE}</h1>
            <p className="text-gray-400 text-sm">{PAGE_SUBTITLE}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="card px-4 py-2 flex items-center gap-3">
              <FaChartLine size={18} className="text-brand-400" />
              <div>
                <p className="text-xs text-gray-400">Overall Progress</p>
                <p className="text-lg font-bold text-white">{overallProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <TopicProgress topics={topics} />

        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleTabChange(TAB_TOPICS)}
            className={tabBase + " " + (activeTab === TAB_TOPICS ? tabActive : tabInactive)}
          >
            <FaBookOpen size={14} />
            Topics
          </button>
          <button
            onClick={handleTabChange(TAB_QUESTIONS)}
            className={tabBase + " " + (activeTab === TAB_QUESTIONS ? tabActive : tabInactive)}
          >
            <FaBrain size={14} />
            Questions
            <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
              {questions.length}
            </span>
          </button>
          <button
            onClick={handleTabChange(TAB_REVISION)}
            className={tabBase + " " + (activeTab === TAB_REVISION ? tabActive : tabInactive)}
          >
            <FaRedo size={14} />
            Revision
            <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
              {revisionQuestions.length}
            </span>
          </button>
        </div>

        {/* Topics Tab */}
        {activeTab === TAB_TOPICS && (
          <React.Fragment>
            <WeakTopics topics={weakTopicsList} onTopicClick={handleTopicClick} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {topics.map(function (topic) {
                return (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onClick={handleTopicClick(topic.id)}
                  />
                );
              })}
            </div>
          </React.Fragment>
        )}

        {/* Questions Tab */}
        {activeTab === TAB_QUESTIONS && (
          <React.Fragment>
            <div className="card p-4 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder={SEARCH_PLACEHOLDER}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full bg-surface border border-surface-border rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {["all", "Easy", "Medium", "Hard"].map(function (filter) {
                    const isActive = difficultyFilter === filter;
                    const btnClass = isActive ? filterBtnActive : filterBtnInactive;
                    function handleClick() {
                      handleDifficultyFilterChange(filter)();
                    }
                    return (
                      <button
                        key={filter}
                        onClick={handleClick}
                        className={filterBtnBase + " " + btnClass}
                      >
                        {filter === "all" ? "All" : filter}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  {["all", "completed", "incomplete"].map(function (filter) {
                    const isActive = statusFilter === filter;
                    const btnClass = isActive ? filterBtnActive : filterBtnInactive;
                    function handleClick() {
                      handleStatusFilterChange(filter)();
                    }
                    return (
                      <button
                        key={filter}
                        onClick={handleClick}
                        className={filterBtnBase + " " + btnClass}
                      >
                        {filter === "all" ? "All Status" : filter === "completed" ? "Done" : "Pending"}
                      </button>
                    );
                  })}
                </div>
              </div>
              {selectedTopic && (
                <div className="flex items-center gap-2 pt-2 border-t border-surface-border">
                  <span className="text-sm text-gray-400">Viewing:</span>
                  <span className="badge-indigo text-xs px-2.5 py-1">{selectedTopic.name}</span>
                  <button
                    onClick={handleBackToTopics}
                    className="text-xs text-brand-400 hover:text-brand-300 ml-2"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddQuestion}
                className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              >
                <FaPlus size={12} />
                Add Question
              </button>
            </div>
            <QuestionList
              questions={filteredQuestions}
              topics={topics}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              onToggleStatus={handleToggleStatus}
              onToggleBookmark={handleToggleBookmark}
            />
          </React.Fragment>
        )}

        {/* Revision Tab */}
        {activeTab === TAB_REVISION && (
          <RevisionSection
            questions={revisionQuestions}
            topics={topics}
            onMarkRevised={handleMarkRevised}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
      </div>

      {/* Question Modal */}
      {showQuestionModal && (
        <QuestionModal
          question={editingQuestion}
          topics={topics}
          onClose={handleModalClose}
          onSave={handleSaveQuestion}
        />
      )}
    </React.Fragment>
  );
}

export default InterviewPrepPage;