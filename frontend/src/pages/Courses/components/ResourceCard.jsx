import React from "react";
import {
  RiFileTextLine,
  RiGithubLine,
  RiGlobalLine,
  RiBookLine,
  RiExternalLinkLine,
} from "react-icons/ri";

const TYPE_MAP = {
  docs:    { icon: RiFileTextLine, color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   label: "Docs"    },
  github:  { icon: RiGithubLine,  color: "text-slate-300",  bg: "bg-white/5",       border: "border-white/10",      label: "GitHub"  },
  website: { icon: RiGlobalLine,  color: "text-brand-400",  bg: "bg-brand-500/10",  border: "border-brand-500/20",  label: "Website" },
  article: { icon: RiBookLine,    color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Article" },
};

function getType(type) {
  return TYPE_MAP[type] || TYPE_MAP.website;
}

function ResourceCard(props) {
  const title   = props.title;
  const type    = props.type;
  const desc    = props.desc;
  const link    = props.link;
  const isFree  = props.isFree;

  const cfg      = getType(type);
  const Icon     = cfg.icon;
  const iconWrap = "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 " + cfg.bg + " " + cfg.border + " border";

  function handleOpen() {
    if (link) window.open(link, "_blank");
  }

  return (
    <div className="card p-4 hover:border-brand-500/20 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className={iconWrap}>
          <Icon className={"text-lg " + cfg.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="text-white font-semibold text-sm leading-tight">
              {title}
            </h4>
            {isFree ? (
              <span className="badge badge-green text-xs">Free</span>
            ) : (
              <span className="badge badge-slate text-xs">Paid</span>
            )}
          </div>
          {desc && (
            <p className="text-slate-400 text-xs leading-relaxed mb-2">
              {desc}
            </p>
          )}
          <button
            onClick={handleOpen}
            className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors"
          >
            Open Resource
            <RiExternalLinkLine className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourceCard;