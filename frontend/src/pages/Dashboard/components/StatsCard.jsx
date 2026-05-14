const StatsCard = ({ title, value, subtitle, icon, color, trend }) => {
  const Icon = icon;

  const colorMap = {
    brand:  { bg: "bg-brand-500/10",  text: "text-brand-400",  border: "border-brand-500/20"  },
    accent: { bg: "bg-accent-500/10", text: "text-accent-400", border: "border-accent-500/20" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
    pink:   { bg: "bg-pink-500/10",   text: "text-pink-400",   border: "border-pink-500/20"   },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  };

  const c = colorMap[color] || colorMap.brand;

  const trendColor = trend && trend.startsWith("+")
    ? "text-accent-400"
    : "text-red-400";

  return (
    <div className={"card p-5 hover:border-brand-500/20 hover:-translate-y-0.5 transition-all duration-200 border " + c.border}>
      <div className="flex items-start justify-between mb-4">
        <div className={"w-10 h-10 rounded-xl flex items-center justify-center " + c.bg}>
          {Icon && <Icon className={"text-xl " + c.text} />}
        </div>
        {trend && (
          <span className={"text-xs font-semibold " + trendColor}>
            {trend}
          </span>
        )}
      </div>
      <div className="font-display text-2xl font-bold text-white mb-1">
        {value}
      </div>
      <div className="text-slate-300 text-sm font-medium mb-0.5">
        {title}
      </div>
      {subtitle && (
        <div className="text-slate-500 text-xs">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatsCard;