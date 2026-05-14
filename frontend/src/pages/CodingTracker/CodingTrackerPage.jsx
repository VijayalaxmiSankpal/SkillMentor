import React from "react";
import { useState, useEffect, useMemo } from "react";
import { FaPlus, FaSearch, FaFilter, FaCode, FaCheckCircle, FaClock, FaTrophy, FaFire } from "react-icons/fa";
import toast from "react-hot-toast";
import ProblemTable from "./components/ProblemTable";
import ProblemCard from "./components/ProblemCard";
import ProblemModal from "./components/ProblemModal";
import DeleteProblemModal from "./components/DeleteProblemModal";
import PlatformFilter from "./components/PlatformFilter";
import StatsOverview from "./components/StatsOverview";

const PAGE_TITLE = "Coding Practice Tracker";
const PAGE_SUBTITLE = "Track your solved problems across platforms and monitor your progress";

const SEARCH_PLACEHOLDER = "Search problems by title or topic...";
const ADD_BUTTON_TEXT = "Add Problem";
const NO_RESULTS_TITLE = "No problems found";
const NO_RESULTS_MESSAGE = "Try adjusting your filters or add a new problem to get started.";

const FILTER_ALL = "all";
const FILTER_EASY = "Easy";
const FILTER_MEDIUM = "Medium";
const FILTER_HARD = "Hard";

const TAB_ALL = "all";
const TAB_SOLVED = "solved";
const TAB_UNSOLVED = "unsolved";
const TAB_BOOKMARKED = "bookmarked";

const VIEW_GRID = "grid";
const VIEW_LIST = "list";

const DIFFICULTY_FILTERS = [
  { label: "All", value: FILTER_ALL },
  { label: "Easy", value: FILTER_EASY },
  { label: "Medium", value: FILTER_MEDIUM },
  { label: "Hard", value: FILTER_HARD },
];

const STATUS_TABS = [
  { label: "All", value: TAB_ALL, count: 0 },
  { label: "Solved", value: TAB_SOLVED, count: 0 },
  { label: "Unsolved", value: TAB_UNSOLVED, count: 0 },
  { label: "Bookmarked", value: TAB_BOOKMARKED, count: 0 },
];

const INITIAL_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    platform: "LeetCode",
    difficulty: "Easy",
    topic: "Arrays",
    status: "solved",
    bookmarked: true,
    timeSpent: 15,
    notes: "Use hash map for O(n) solution",
    link: "https://leetcode.com/problems/two-sum",
    solvedDate: "2025-04-10",
  },
  {
    id: 2,
    title: "Valid Parentheses",
    platform: "LeetCode",
    difficulty: "Easy",
    topic: "Stack",
    status: "solved",
    bookmarked: false,
    timeSpent: 20,
    notes: "Stack-based approach",
    link: "https://leetcode.com/problems/valid-parentheses",
    solvedDate: "2025-04-12",
  },
  {
    id: 3,
    title: "Merge Intervals",
    platform: "LeetCode",
    difficulty: "Medium",
    topic: "Arrays",
    status: "solved",
    bookmarked: true,
    timeSpent: 35,
    notes: "Sort by start time first",
    link: "https://leetcode.com/problems/merge-intervals",
    solvedDate: "2025-04-15",
  },
  {
    id: 4,
    title: "LRU Cache",
    platform: "LeetCode",
    difficulty: "Medium",
    topic: "Hash Table",
    status: "unsolved",
    bookmarked: false,
    timeSpent: 0,
    notes: "",
    link: "https://leetcode.com/problems/lru-cache",
    solvedDate: null,
  },
  {
    id: 5,
    title: "Trapping Rain Water",
    platform: "LeetCode",
    difficulty: "Hard",
    topic: "Two Pointers",
    status: "unsolved",
    bookmarked: true,
    timeSpent: 0,
    notes: "Two pointer approach with max walls",
    link: "https://leetcode.com/problems/trapping-rain-water",
    solvedDate: null,
  },
  {
    id: 6,
    title: "A. Watermelon",
    platform: "Codeforces",
    difficulty: "Easy",
    topic: "Math",
    status: "solved",
    bookmarked: false,
    timeSpent: 10,
    notes: "Check if even and greater than 2",
    link: "https://codeforces.com/problemset/problem/4/A",
    solvedDate: "2025-04-08",
  },
  {
    id: 7,
    title: "B. Queue at the School",
    platform: "Codeforces",
    difficulty: "Easy",
    topic: "Simulation",
    status: "solved",
    bookmarked: false,
    timeSpent: 18,
    notes: "",
    link: "https://codeforces.com/problemset/problem/266/B",
    solvedDate: "2025-04-09",
  },
  {
    id: 8,
    title: "Longest Common Subsequence",
    platform: "GeeksforGeeks",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    status: "unsolved",
    bookmarked: true,
    timeSpent: 0,
    notes: "Classic DP problem",
    link: "https://www.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1",
    solvedDate: null,
  },
  {
    id: 9,
    title: "Number of Islands",
    platform: "LeetCode",
    difficulty: "Medium",
    topic: "Graph",
    status: "solved",
    bookmarked: false,
    timeSpent: 40,
    notes: "BFS or DFS approach",
    link: "https://leetcode.com/problems/number-of-islands",
    solvedDate: "2025-04-18",
  },
  {
    id: 10,
    title: "Word Ladder",
    platform: "LeetCode",
    difficulty: "Hard",
    topic: "Graph",
    status: "unsolved",
    bookmarked: false,
    timeSpent: 0,
    notes: "BFS with word transformation",
    link: "https://leetcode.com/problems/word-ladder",
    solvedDate: null,
  },
  {
    id: 11,
    title: "A. Beautiful Matrix",
    platform: "Codeforces",
    difficulty: "Easy",
    topic: "Implementation",
    status: "solved",
    bookmarked: false,
    timeSpent: 12,
    notes: "",
    link: "https://codeforces.com/problemset/problem/263/A",
    solvedDate: "2025-04-11",
  },
  {
    id: 12,
    title: "Kadane's Algorithm",
    platform: "GeeksforGeeks",
    difficulty: "Easy",
    topic: "Arrays",
    status: "solved",
    bookmarked: true,
    timeSpent: 15,
    notes: "Track max sum ending at each index",
    link: "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1",
    solvedDate: "2025-04-14",
  },
];

function CodingTrackerPage() {
  const [problems, setProblems] = useState(INITIAL_PROBLEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState(FILTER_ALL);
  const [platformFilter, setPlatformFilter] = useState(FILTER_ALL);
  const [topicFilter, setTopicFilter] = useState(FILTER_ALL);
  const [statusTab, setStatusTab] = useState(TAB_ALL);
  const [viewMode, setViewMode] = useState(VIEW_GRID);
  const [showModal, setShowModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [deletingProblem, setDeletingProblem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const topics = useMemo(function () {
    const allTopics = problems.map(function (p) {
      return p.topic;
    });
    const uniqueTopics = [...new Set(allTopics)];
    return uniqueTopics.sort();
  }, [problems]);

  const filteredProblems = useMemo(function () {
    return problems.filter(function (problem) {
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.topic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === FILTER_ALL || problem.difficulty === difficultyFilter;
      const matchesPlatform = platformFilter === FILTER_ALL || problem.platform === platformFilter;
      const matchesTopic = topicFilter === FILTER_ALL || problem.topic === topicFilter;

      let matchesStatus = true;
      if (statusTab === TAB_SOLVED) {
        matchesStatus = problem.status === "solved";
      } else if (statusTab === TAB_UNSOLVED) {
        matchesStatus = problem.status === "unsolved";
      } else if (statusTab === TAB_BOOKMARKED) {
        matchesStatus = problem.bookmarked === true;
      }

      return matchesSearch && matchesDifficulty && matchesPlatform && matchesTopic && matchesStatus;
    });
  }, [problems, searchQuery, difficultyFilter, platformFilter, topicFilter, statusTab]);

  const stats = useMemo(function () {
    const total = problems.length;
    const solved = problems.filter(function (p) {
      return p.status === "solved";
    }).length;
    const unsolved = problems.filter(function (p) {
      return p.status === "unsolved";
    }).length;
    const bookmarked = problems.filter(function (p) {
      return p.bookmarked === true;
    }).length;
    const easySolved = problems.filter(function (p) {
      return p.status === "solved" && p.difficulty === "Easy";
    }).length;
    const mediumSolved = problems.filter(function (p) {
      return p.status === "solved" && p.difficulty === "Medium";
    }).length;
    const hardSolved = problems.filter(function (p) {
      return p.status === "solved" && p.difficulty === "Hard";
    }).length;
    const totalTime = problems.reduce(function (sum, p) {
      return sum + p.timeSpent;
    }, 0);
    const streak = 5;

    return { total, solved, unsolved, bookmarked, easySolved, mediumSolved, hardSolved, totalTime, streak };
  }, [problems]);

  const tabCounts = useMemo(function () {
    return {
      all: problems.length,
      solved: problems.filter(function (p) {
        return p.status === "solved";
      }).length,
      unsolved: problems.filter(function (p) {
        return p.status === "unsolved";
      }).length,
      bookmarked: problems.filter(function (p) {
        return p.bookmarked === true;
      }).length,
    };
  }, [problems]);

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
  }

  function handleDifficultyClick(filter) {
    setDifficultyFilter(filter);
  }

  function handlePlatformChange(platform) {
    setPlatformFilter(platform);
  }

  function handleTopicChange(topic) {
    setTopicFilter(topic);
  }

  function handleStatusTabClick(tab) {
    setStatusTab(tab);
  }

  function handleViewModeGrid() {
    setViewMode(VIEW_GRID);
  }

  function handleViewModeList() {
    setViewMode(VIEW_LIST);
  }

  function handleToggleFilters() {
    setShowFilters(!showFilters);
  }

  function handleAddClick() {
    setEditingProblem(null);
    setShowModal(true);
  }

  function handleEditClick(problem) {
    setEditingProblem(problem);
    setShowModal(true);
  }

  function handleDeleteClick(problem) {
    setDeletingProblem(problem);
  }

  function handleModalClose() {
    setShowModal(false);
    setEditingProblem(null);
  }

  function handleDeleteModalClose() {
    setDeletingProblem(null);
  }

  function handleSaveProblem(problemData) {
    if (editingProblem) {
      setProblems(function (prev) {
        return prev.map(function (p) {
          if (p.id === editingProblem.id) {
            return { ...p, ...problemData };
          }
          return p;
        });
      });
      toast.success("Problem updated successfully!");
    } else {
      const newProblem = {
        id: Date.now(),
        ...problemData,
        solvedDate: problemData.status === "solved" ? new Date().toISOString().split("T")[0] : null,
      };
      setProblems(function (prev) {
        return [...prev, newProblem];
      });
      toast.success("Problem added successfully!");
    }
    setShowModal(false);
    setEditingProblem(null);
  }

  function handleConfirmDelete() {
    if (deletingProblem) {
      setProblems(function (prev) {
        return prev.filter(function (p) {
          return p.id !== deletingProblem.id;
        });
      });
      toast.success("Problem deleted successfully!");
      setDeletingProblem(null);
    }
  }

  function handleToggleStatus(problemId) {
    setProblems(function (prev) {
      return prev.map(function (p) {
        if (p.id === problemId) {
          const newStatus = p.status === "solved" ? "unsolved" : "solved";
          return {
            ...p,
            status: newStatus,
            solvedDate: newStatus === "solved" ? new Date().toISOString().split("T")[0] : null,
          };
        }
        return p;
      });
    });
    toast.success("Status updated!");
  }

  function handleToggleBookmark(problemId) {
    setProblems(function (prev) {
      return prev.map(function (p) {
        if (p.id === problemId) {
          return { ...p, bookmarked: !p.bookmarked };
        }
        return p;
      });
    });
  }

  function handleOpenLink(url) {
    window.open(url, "_blank");
  }

  const searchInputClass = "w-full bg-surface-card border border-surface-border rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all";
  const filterBtnBase = "px-4 py-2 rounded-lg text-sm font-medium transition-all border";
  const filterBtnActive = "bg-brand-500 text-white border-brand-500";
  const filterBtnInactive = "bg-surface-card text-gray-400 border-surface-border hover:border-gray-500";
  const tabBase = "px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2";
  const tabActive = "bg-brand-500/20 text-brand-400 border border-brand-500/30";
  const tabInactive = "text-gray-400 hover:text-white hover:bg-surface-card border border-transparent";
  const viewBtnBase = "p-2.5 rounded-lg transition-all border";
  const viewBtnActive = "bg-surface-card text-brand-400 border-brand-500/30";
  const viewBtnInactive = "text-gray-500 hover:text-white border-transparent";

  return (
    <React.Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">{PAGE_TITLE}</h1>
            <p className="text-gray-400 text-sm">{PAGE_SUBTITLE}</p>
          </div>
          <button
            onClick={handleAddClick}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm self-start"
          >
            <FaPlus size={14} />
            {ADD_BUTTON_TEXT}
          </button>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Search and Filters Bar */}
        <div className="card p-4 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder={SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={handleSearchChange}
                className={searchInputClass}
              />
            </div>

            {/* Difficulty Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {DIFFICULTY_FILTERS.map(function (filter) {
                const isActive = difficultyFilter === filter.value;
                const btnClass = isActive ? filterBtnActive : filterBtnInactive;
                function handleClick() {
                  handleDifficultyClick(filter.value);
                }
                return (
                  <button
                    key={filter.value}
                    onClick={handleClick}
                    className={filterBtnBase + " " + btnClass}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-surface rounded-lg p-1">
              <button
                onClick={handleViewModeGrid}
                className={viewBtnBase + " " + (viewMode === VIEW_GRID ? viewBtnActive : viewBtnInactive)}
                title="Grid view"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                onClick={handleViewModeList}
                className={viewBtnBase + " " + (viewMode === VIEW_LIST ? viewBtnActive : viewBtnInactive)}
                title="List view"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={handleToggleFilters}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-card border border-surface-border text-gray-400 hover:text-white text-sm font-medium transition-all"
            >
              <FaFilter size={14} />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="pt-4 border-t border-surface-border space-y-4">
              <PlatformFilter
                selectedPlatform={platformFilter}
                onPlatformChange={handlePlatformChange}
                selectedTopic={topicFilter}
                onTopicChange={handleTopicChange}
                topics={topics}
              />
            </div>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_TABS.map(function (tab) {
            const isActive = statusTab === tab.value;
            const tabClass = isActive ? tabActive : tabInactive;
            const count = tabCounts[tab.value] || 0;
            function handleClick() {
              handleStatusTabClick(tab.value);
            }
            return (
              <button
                key={tab.value}
                onClick={handleClick}
                className={tabBase + " " + tabClass}
              >
                {tab.label}
                <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Problems Display */}
        {filteredProblems.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
              <FaCode size={28} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{NO_RESULTS_TITLE}</h3>
            <p className="text-gray-400 text-sm">{NO_RESULTS_MESSAGE}</p>
          </div>
        ) : viewMode === VIEW_GRID ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProblems.map(function (problem) {
              return (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onToggleStatus={handleToggleStatus}
                  onToggleBookmark={handleToggleBookmark}
                  onOpenLink={handleOpenLink}
                />
              );
            })}
          </div>
        ) : (
          <ProblemTable
            problems={filteredProblems}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onToggleStatus={handleToggleStatus}
            onToggleBookmark={handleToggleBookmark}
            onOpenLink={handleOpenLink}
          />
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <ProblemModal
          problem={editingProblem}
          onClose={handleModalClose}
          onSave={handleSaveProblem}
        />
      )}

      {deletingProblem && (
        <DeleteProblemModal
          problem={deletingProblem}
          onClose={handleDeleteModalClose}
          onConfirm={handleConfirmDelete}
        />
      )}
    </React.Fragment>
  );
}

export default CodingTrackerPage;