import React from "react";
import { RiCheckboxCircleLine, RiTimeLine, RiLockLine, RiExternalLinkLine } from "react-icons/ri";

const COMPLETED_CFG = { icon: RiCheckboxCircleLine, color: "text-accent-400", bg: "bg-accent-500/10", border: "border-accent-500/20", label: "Completed" };
const ACTIVE_CFG = { icon: RiTimeLine, color: "text-brand-400", bg: "bg-brand-500/10", border: "border-brand-500/30", label: "In Progress" };
const LOCKED_CFG = { icon: RiLockLine, color: "text-slate-500", bg: "bg-white/5", border: "border-white/10", label: "Locked" };

function getConfig(status) {
    if (status === "completed") return COMPLETED_CFG;
    if (status === "active") return ACTIVE_CFG;
    return LOCKED_CFG;
}

function TopicTag(props) {
    return (
        <span className="text-xs px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 border border-white/10">
            {props.text}
        </span>
    );
}

function SkillCard(props) {
    const name = props.name;
    const status = props.status;
    const duration = props.duration;
    const topics = props.topics;
    const link = props.link;

    const cfg = getConfig(status);
    const Icon = cfg.icon;
    const isLocked = status === "locked";

    const cardClass = isLocked
        ? "card p-4 opacity-60"
        : "card p-4 hover:-translate-y-0.5 hover:border-brand-500/20 transition-all duration-200";

    const badgeClass = "badge text-xs " + cfg.bg + " " + cfg.color + " " + cfg.border;

    function handleClick() {
        if (link) window.open(link, "_blank");
    }

    return (
        <div className={cardClass}>

            <div className="flex items-start justify-between gap-2 mb-3">
                <h4 className="font-semibold text-white text-sm leading-tight">
                    {name}
                </h4>
                <div className={badgeClass}>
                    <Icon className="text-xs" />
                    {cfg.label}
                </div>
            </div>

            {duration ? (
                <p className="text-slate-500 text-xs mb-3 flex items-center gap-1">
                    <RiTimeLine />
                    {duration}
                </p>
            ) : null}

            {topics && topics.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {topics.map(function (t, i) {
                        return <TopicTag key={i} text={t} />;
                    })}
                </div>
            ) : null}

            {link && !isLocked ? (
                <button
                    onClick={handleClick}
                    className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors"
                >
                    View Resources
                    <RiExternalLinkLine />
                </button>
            ) : null}

        </div>
    );
}

export default SkillCard;