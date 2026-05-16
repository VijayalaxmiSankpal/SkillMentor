import React from "react";
import { useState } from "react";
import { FaTimes, FaStar, FaThumbsUp, FaArrowUp, FaCheck } from "react-icons/fa";
import RatingStars from "./RatingStars";

const MODAL_TITLE = "Interview Feedback";
const RATING_LABEL = "Overall Rating";
const FEEDBACK_LABEL = "General Feedback";
const STRENGTHS_LABEL = "Strengths (one per line)";
const IMPROVEMENTS_LABEL = "Areas to Improve (one per line)";
const SAVE_BUTTON = "Save Feedback";
const CANCEL_BUTTON = "Cancel";

function getInitialState(interview) {
  return {
    rating: interview.rating || 3,
    feedback: interview.feedback || "",
    strengths: interview.strengths ? interview.strengths.join("\n") : "",
    improvements: interview.improvements ? interview.improvements.join("\n") : "",
  };
}

function FeedbackModal(props) {
  const interview = props.interview;

  const initialState = getInitialState(interview);
  const [rating, setRating] = useState(initialState.rating);
  const [feedback, setFeedback] = useState(initialState.feedback);
  const [strengths, setStrengths] = useState(initialState.strengths);
  const [improvements, setImprovements] = useState(initialState.improvements);

  function handleRatingChange(newRating) {
    return function () {
      setRating(newRating);
    };
  }

  function handleFeedbackChange(e) {
    setFeedback(e.target.value);
  }

  function handleStrengthsChange(e) {
    setStrengths(e.target.value);
  }

  function handleImprovementsChange(e) {
    setImprovements(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const strengthsList = strengths
      .split("\n")
      .map(function (s) {
        return s.trim();
      })
      .filter(function (s) {
        return s.length > 0;
      });

    const improvementsList = improvements
      .split("\n")
      .map(function (s) {
        return s.trim();
      })
      .filter(function (s) {
        return s.length > 0;
      });

    const feedbackData = {
      rating: rating,
      feedback: feedback.trim(),
      strengths: strengthsList,
      improvements: improvementsList,
    };

    props.onSave(interview.id, feedbackData);
  }

  function handleClose() {
    props.onClose();
  }

  const overlayClass = "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4";
  const modalClass = "bg-surface-card border border-surface-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl";
  const inputClass = "w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm";
  const textareaClass = "w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm resize-none";
  const labelClass = "block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5";
  const btnPrimary = "flex-1 bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2";
  const btnSecondary = "flex-1 bg-surface hover:bg-surface-border text-white font-medium py-2.5 px-5 rounded-xl transition-all border border-surface-border";

  return (
    <div className={overlayClass} onClick={handleClose}>
      <div className={modalClass} onClick={function (e) { e.stopPropagation(); }}>
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <h2 className="text-xl font-display font-bold text-white">{MODAL_TITLE}</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-all"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelClass}>{RATING_LABEL}</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(function (star) {
                function handleClick() {
                  handleRatingChange(star)();
                }
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={handleClick}
                    className="p-1 transition-all hover:scale-110"
                  >
                    <FaStar
                      size={24}
                      className={star <= rating ? "text-amber-400" : "text-gray-600"}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-sm text-white font-semibold">{rating}/5</span>
            </div>
          </div>

          <div>
            <label className={labelClass}>{FEEDBACK_LABEL}</label>
            <div className="relative">
              <FaThumbsUp className="absolute left-3.5 top-3 text-gray-500" size={14} />
              <textarea
                value={feedback}
                onChange={handleFeedbackChange}
                placeholder="Overall thoughts on the interview performance..."
                rows={3}
                className={textareaClass + " pl-10"}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>{STRENGTHS_LABEL}</label>
            <div className="relative">
              <FaThumbsUp className="absolute left-3.5 top-3 text-emerald-500" size={14} />
              <textarea
                value={strengths}
                onChange={handleStrengthsChange}
                placeholder="What went well?"
                rows={3}
                className={textareaClass + " pl-10"}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>{IMPROVEMENTS_LABEL}</label>
            <div className="relative">
              <FaArrowUp className="absolute left-3.5 top-3 text-amber-500" size={14} />
              <textarea
                value={improvements}
                onChange={handleImprovementsChange}
                placeholder="What needs improvement?"
                rows={3}
                className={textareaClass + " pl-10"}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose} className={btnSecondary}>
              {CANCEL_BUTTON}
            </button>
            <button type="submit" className={btnPrimary}>
              <FaCheck size={14} />
              {SAVE_BUTTON}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackModal;