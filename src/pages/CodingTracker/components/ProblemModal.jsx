import React from "react";
import { useState } from "react";
import { FaTimes, FaLink, FaClock, FaStickyNote, FaTag, FaLayerGroup, FaCode, FaCheck, FaRegCircle } from "react-icons/fa";

const MODAL_TITLE_ADD = "Add New Problem";
const MODAL_TITLE_EDIT = "Edit Problem";
const SAVE_BUTTON_TEXT = "Save Problem";
const CANCEL_BUTTON_TEXT = "Cancel";

const PLATFORMS = ["LeetCode", "Codeforces", "GeeksforGeeks", "HackerRank", "CodeChef", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const TOPICS = [
  "Arrays", "Strings", "Linked List", "Stack", "Queue", "Tree", "Graph",
  "Dynamic Programming", "Greedy", "Backtracking", "Sorting", "Searching",
  "Hash Table", "Two Pointers", "Sliding Window", "Math", "Bit Manipulation",
  "Recursion", "Heap", "Trie", "Union Find", "Segment Tree", "Binary Search",
  "Simulation", "Implementation", "Other",
];

function getInitialState(problem) {
  if (problem) {
    return {
      title: problem.title || "",
      platform: problem.platform || "LeetCode",
      difficulty: problem.difficulty || "Easy",
      topic: problem.topic || "Arrays",
      status: problem.status || "unsolved",
      link: problem.link || "",
      timeSpent: problem.timeSpent ? String(problem.timeSpent) : "",
      notes: problem.notes || "",
      bookmarked: problem.bookmarked || false,
    };
  }
  return {
    title: "",
    platform: "LeetCode",
    difficulty: "Easy",
    topic: "Arrays",
    status: "unsolved",
    link: "",
    timeSpent: "",
    notes: "",
    bookmarked: false,
  };
}

function ProblemModal(props) {
  const problem = props.problem;
  const isEditing = problem !== null;

  const initialState = getInitialState(problem);
  const [title, setTitle] = useState(initialState.title);
  const [platform, setPlatform] = useState(initialState.platform);
  const [difficulty, setDifficulty] = useState(initialState.difficulty);
  const [topic, setTopic] = useState(initialState.topic);
  const [status, setStatus] = useState(initialState.status);
  const [link, setLink] = useState(initialState.link);
  const [timeSpent, setTimeSpent] = useState(initialState.timeSpent);
  const [notes, setNotes] = useState(initialState.notes);
  const [bookmarked, setBookmarked] = useState(initialState.bookmarked);
  const [errors, setErrors] = useState({});

  function handleTitleChange(e) {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors(function (prev) {
        const next = { ...prev };
        delete next.title;
        return next;
      });
    }
  }

  function handlePlatformChange(e) {
    setPlatform(e.target.value);
  }

  function handleDifficultyChange(e) {
    setDifficulty(e.target.value);
  }

  function handleTopicChange(e) {
    setTopic(e.target.value);
  }

  function handleStatusChange(e) {
    setStatus(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleTimeSpentChange(e) {
    setTimeSpent(e.target.value);
  }

  function handleNotesChange(e) {
    setNotes(e.target.value);
  }

  function handleBookmarkToggle() {
    setBookmarked(!bookmarked);
  }

  function validate() {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!link.trim()) {
      newErrors.link = "Problem link is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const problemData = {
      title: title.trim(),
      platform: platform,
      difficulty: difficulty,
      topic: topic,
      status: status,
      link: link.trim(),
      timeSpent: parseInt(timeSpent) || 0,
      notes: notes.trim(),
      bookmarked: bookmarked,
    };

    props.onSave(problemData);
  }

  function handleClose() {
    props.onClose();
  }

  const overlayClass = "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4";
  const modalClass = "bg-surface-card border border-surface-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl";
  const inputClass = "w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm";
  const selectClass = "w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm appearance-none cursor-pointer";
  const labelClass = "block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5";
  const errorClass = "text-rose-400 text-xs mt-1";
  const btnPrimary = "flex-1 bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2";
  const btnSecondary = "flex-1 bg-surface hover:bg-surface-border text-white font-medium py-2.5 px-5 rounded-xl transition-all border border-surface-border";

  return (
    <div className={overlayClass} onClick={handleClose}>
      <div className={modalClass} onClick={function (e) { e.stopPropagation(); }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <h2 className="text-xl font-display font-bold text-white">
            {isEditing ? MODAL_TITLE_EDIT : MODAL_TITLE_ADD}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-all"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className={labelClass}>Problem Title *</label>
            <div className="relative">
              <FaCode className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Two Sum"
                className={inputClass + " pl-10"}
              />
            </div>
            {errors.title && <p className={errorClass}>{errors.title}</p>}
          </div>

          {/* Platform & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Platform</label>
              <div className="relative">
                <FaLayerGroup className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <select
                  value={platform}
                  onChange={handlePlatformChange}
                  className={selectClass + " pl-10"}
                >
                  {PLATFORMS.map(function (p) {
                    return <option key={p} value={p}>{p}</option>;
                  })}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Difficulty</label>
              <div className="relative">
                <FaTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <select
                  value={difficulty}
                  onChange={handleDifficultyChange}
                  className={selectClass + " pl-10"}
                >
                  {DIFFICULTIES.map(function (d) {
                    return <option key={d} value={d}>{d}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className={labelClass}>Topic</label>
            <div className="relative">
              <FaTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <select
                value={topic}
                onChange={handleTopicChange}
                className={selectClass + " pl-10"}
              >
                {TOPICS.map(function (t) {
                  return <option key={t} value={t}>{t}</option>;
                })}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={function () { setStatus("unsolved"); }}
                className={"flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 " +
                  (status === "unsolved"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-surface text-gray-400 border-surface-border hover:text-white")}
              >
                <FaRegCircle size={14} />
                Unsolved
              </button>
              <button
                type="button"
                onClick={function () { setStatus("solved"); }}
                className={"flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 " +
                  (status === "solved"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-surface text-gray-400 border-surface-border hover:text-white")}
              >
                <FaCheck size={14} />
                Solved
              </button>
            </div>
          </div>

          {/* Link */}
          <div>
            <label className={labelClass}>Problem Link *</label>
            <div className="relative">
              <FaLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="url"
                value={link}
                onChange={handleLinkChange}
                placeholder="https://..."
                className={inputClass + " pl-10"}
              />
            </div>
            {errors.link && <p className={errorClass}>{errors.link}</p>}
          </div>

          {/* Time Spent */}
          <div>
            <label className={labelClass}>Time Spent (minutes)</label>
            <div className="relative">
              <FaClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="number"
                value={timeSpent}
                onChange={handleTimeSpentChange}
                placeholder="e.g. 30"
                min="0"
                className={inputClass + " pl-10"}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <div className="relative">
              <FaStickyNote className="absolute left-3.5 top-3 text-gray-500" size={14} />
              <textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="Your approach, key insights, etc."
                rows={3}
                className={inputClass + " pl-10 resize-none"}
              />
            </div>
          </div>

          {/* Bookmark Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBookmarkToggle}
              className={"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all " +
                (bookmarked
                  ? "bg-pink-500/10 text-pink-400 border-pink-500/30"
                  : "bg-surface text-gray-400 border-surface-border hover:text-white")}
            >
              {bookmarked ? "Bookmarked" : "Add Bookmark"}
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose} className={btnSecondary}>
              {CANCEL_BUTTON_TEXT}
            </button>
            <button type="submit" className={btnPrimary}>
              <FaCheck size={14} />
              {SAVE_BUTTON_TEXT}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProblemModal;