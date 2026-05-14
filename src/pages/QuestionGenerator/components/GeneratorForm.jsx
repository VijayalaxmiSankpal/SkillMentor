import React from "react";
import { FaWandMagicSparkles, FaSpinner } from "react-icons/fa";
import RoleSelector from "./RoleSelector";
import TopicSelector from "./TopicSelector";

const COUNT_OPTIONS = [3, 5, 10, 15];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];

function GeneratorForm(props) {
  const isGenerating = props.isGenerating;

  function handleGenerateClick() {
    props.onGenerate();
  }

  function handleDifficultyClick(diff) {
    return function () {
      props.onDifficultyChange(diff)();
    };
  }

  function handleCountClick(count) {
    return function () {
      props.onCountChange(count)();
    };
  }

  const diffBtnBase = "px-4 py-2 rounded-lg text-sm font-medium transition-all border";
  const diffBtnActive = "bg-brand-500 text-white border-brand-500";
  const diffBtnInactive = "bg-surface text-gray-400 border-surface-border hover:border-gray-500";

  const countBtnBase = "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border";
  const countBtnActive = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  const countBtnInactive = "bg-surface text-gray-400 border-surface-border hover:border-gray-500";

  return (
    <div className="space-y-4">
      <RoleSelector
        roles={props.roles}
        selectedRole={props.selectedRole}
        onRoleSelect={props.onRoleSelect}
      />

      <TopicSelector
        availableTopics={props.availableTopics}
        selectedTopics={props.selectedTopics}
        onTopicToggle={props.onTopicToggle}
      />

      <div className="card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Difficulty</h3>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map(function (diff) {
                const isActive = props.difficulty === diff;
                const btnClass = isActive ? diffBtnActive : diffBtnInactive;
                function handleClick() {
                  handleDifficultyClick(diff)();
                }
                return (
                  <button
                    key={diff}
                    onClick={handleClick}
                    className={diffBtnBase + " " + btnClass}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Number of Questions</h3>
            <div className="flex gap-2">
              {COUNT_OPTIONS.map(function (count) {
                const isActive = props.questionCount === count;
                const btnClass = isActive ? countBtnActive : countBtnInactive;
                function handleClick() {
                  handleCountClick(count)();
                }
                return (
                  <button
                    key={count}
                    onClick={handleClick}
                    className={countBtnBase + " " + btnClass}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <React.Fragment>
              <FaSpinner size={16} className="animate-spin" />
              Generating...
            </React.Fragment>
          ) : (
            <React.Fragment>
              <FaWandMagicSparkles size={16} />
              Generate Questions
            </React.Fragment>
          )}
        </button>
      </div>
    </div>
  );
}

export default GeneratorForm;