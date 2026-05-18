import React from "react";
import { useState } from "react";
import { FaCalendarAlt, FaClock, FaHourglassHalf, FaAlignLeft, FaBriefcase, FaLayerGroup, FaCheck } from "react-icons/fa";

const FORM_TITLE = "Schedule Mock Interview";
const DATE_LABEL = "Date";
const TIME_LABEL = "Time";
const DURATION_LABEL = "Duration (minutes)";
const TYPE_LABEL = "Interview Type";
const ROLE_LABEL = "Target Role";
const NOTES_LABEL = "Notes / Focus Areas";
const SCHEDULE_BUTTON = "Schedule Interview";

const DURATION_OPTIONS = [30, 45, 60, 90, 120];

function ScheduleForm(props) {
  const interviewTypes = props.interviewTypes;
  const roles = props.roles;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [type, setType] = useState(interviewTypes[0]);
  const [role, setRole] = useState(roles[0]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  function handleDateChange(e) {
    setDate(e.target.value);
    if (errors.date) {
      setErrors(function (prev) {
        const next = { ...prev };
        delete next.date;
        return next;
      });
    }
  }

  function handleTimeChange(e) {
    setTime(e.target.value);
    if (errors.time) {
      setErrors(function (prev) {
        const next = { ...prev };
        delete next.time;
        return next;
      });
    }
  }

  function handleDurationChange(e) {
    setDuration(parseInt(e.target.value));
  }

  function handleTypeChange(e) {
    setType(e.target.value);
  }

  function handleRoleChange(e) {
    setRole(e.target.value);
  }

  function handleNotesChange(e) {
    setNotes(e.target.value);
  }

  function validate() {
    const newErrors = {};
    if (!date) {
      newErrors.date = "Date is required";
    }
    if (!time) {
      newErrors.time = "Time is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const interviewData = {
  date: date,
  time: time,
  duration: duration,
  role: role,
  type: type.toLowerCase(),
  difficulty: "medium",
};

    props.onSchedule(interviewData);
  }

  const inputClass = "w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm";
  const selectClass = "w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm appearance-none cursor-pointer";
  const labelClass = "block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5";
  const errorClass = "text-rose-400 text-xs mt-1";
  const btnPrimary = "w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2";

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="card p-6 max-w-2xl">
      <h2 className="text-xl font-display font-bold text-white mb-6">{FORM_TITLE}</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{DATE_LABEL} *</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                min={minDate}
                className={inputClass + " pl-10"}
              />
            </div>
            {errors.date && <p className={errorClass}>{errors.date}</p>}
          </div>

          <div>
            <label className={labelClass}>{TIME_LABEL} *</label>
            <div className="relative">
              <FaClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="time"
                value={time}
                onChange={handleTimeChange}
                className={inputClass + " pl-10"}
              />
            </div>
            {errors.time && <p className={errorClass}>{errors.time}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{DURATION_LABEL}</label>
            <div className="relative">
              <FaHourglassHalf className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <select
                value={duration}
                onChange={handleDurationChange}
                className={selectClass + " pl-10"}
              >
                {DURATION_OPTIONS.map(function (d) {
                  return <option key={d} value={d}>{d} minutes</option>;
                })}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>{TYPE_LABEL}</label>
            <div className="relative">
              <FaLayerGroup className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <select
                value={type}
                onChange={handleTypeChange}
                className={selectClass + " pl-10"}
              >
                {interviewTypes.map(function (t) {
                  return <option key={t} value={t}>{t}</option>;
                })}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>{ROLE_LABEL}</label>
          <div className="relative">
            <FaBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <select
              value={role}
              onChange={handleRoleChange}
              className={selectClass + " pl-10"}
            >
              {roles.map(function (r) {
                return <option key={r} value={r}>{r}</option>;
              })}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>{NOTES_LABEL}</label>
          <div className="relative">
            <FaAlignLeft className="absolute left-3.5 top-3 text-gray-500" size={14} />
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="What do you want to focus on during this mock interview?"
              rows={3}
              className={inputClass + " pl-10 resize-none"}
            />
          </div>
        </div>

        <button type="submit" className={btnPrimary}>
          <FaCheck size={14} />
          {SCHEDULE_BUTTON}
        </button>
      </form>
    </div>
  );
}

export default ScheduleForm;