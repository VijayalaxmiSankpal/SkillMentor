import React from "react";
import { useState } from "react";
import { FaTimes, FaQuestionCircle, FaAlignLeft, FaTag, FaLayerGroup, FaCheck } from "react-icons/fa";

const MODAL_TITLE_ADD = "Add Interview Question";
const MODAL_TITLE_EDIT = "Edit Question";
const SAVE_BUTTON_TEXT = "Save Question";
const CANCEL_BUTTON_TEXT = "Cancel";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

function getInitialState(question) {
  if (question) {
    return {
      question: question.question || "",
      answer: question.answer || "",
      topicId: question.topicId || "",
      difficulty: question.difficulty || "Easy",
      bookmarked: question.bookmarked || false,
    };
  }
  return {
    question: "",
    answer: "",
    topicId: "",
    difficulty: "Easy",
    bookmarked: false,
  };
}

function QuestionModal(props) {
  const question = props.question;
  const topics = props.topics;
  const isEditing = question !== null;

  const initialState = getInitialState(question);
  const [questionText, setQuestionText] = useState(initialState.question);
  const [answerText, setAnswerText] = useState(initialState.answer);
  const [topicId, setTopicId] = useState(initialState.topicId);
  const [difficulty, setDifficulty] = useState(initialState.difficulty);
  const [bookmarked, setBookmarked] = useState(initialState.bookmarked);
  const [errors, setErrors] = useState({});

  function handleQuestionChange(e) {
    setQuestionText(e.target.value);
    if (errors.question) {
      setErrors(function (prev) {
        const next = { ...prev };
        delete next.question;
        return next;
      });
    }
  }

  function handleAnswerChange(e) {
    setAnswerText(e.target.value);
    if (errors.answer) {
      setErrors(function (prev) {
        const next = { ...prev };
        delete next.answer;
        return next;
      });
    }
  }

  function handleTopicChange(e) {
    setTopicId(e.target.value);
  }

  function handleDifficultyChange(e) {
    setDifficulty(e.target.value);
  }

  function handleBookmarkToggle() {
    setBookmarked(!bookmarked);
  }

  function validate() {
    const newErrors = {};
    if (!questionText.trim()) {
      newErrors.question = "Question is required";
    }
    if (!answerText.trim()) {
      newErrors.answer = "Answer is required";
    }
    if (!topicId) {
      newErrors.topicId = "Topic is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const questionData = {
      question: questionText.trim(),
      answer: answerText.trim(),
      topicId: topicId,
      difficulty: difficulty,
      bookmarked: bookmarked,
    };

    props.onSave(questionData);
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelClass}>Question *</label>
            <div className="relative">
              <FaQuestionCircle className="absolute left-3.5 top-3 text-gray-500" size={14} />
              <textarea
                value={questionText}
                onChange={handleQuestionChange}
                placeholder="Enter the interview question..."
                rows={3}
                className={inputClass + " pl-10 resize-none"}
              />
            </div>
            {errors.question && <p className={errorClass}>{errors.question}</p>}
          </div>

          <div>
            <label className={labelClass}>Answer *</label>
            <div className="relative">
              <FaAlignLeft className="absolute left-3.5 top-3 text-gray-500" size={14} />
              <textarea
                value={answerText}
                onChange={handleAnswerChange}
                placeholder="Enter the answer or explanation..."
                rows={5}
                className={inputClass + " pl-10 resize-none"}
              />
            </div>
            {errors.answer && <p className={errorClass}>{errors.answer}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Topic *</label>
              <div className="relative">
                <FaLayerGroup className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <select
                  value={topicId}
                  onChange={handleTopicChange}
                  className={selectClass + " pl-10"}
                >
                  <option value="">Select topic</option>
                  {topics.map(function (t) {
                    return <option key={t.id} value={t.id}>{t.name}</option>;
                  })}
                </select>
              </div>
              {errors.topicId && <p className={errorClass}>{errors.topicId}</p>}
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

export default QuestionModal;