import {
  RiRoadMapLine,
  RiCodeSSlashLine,
  RiFileTextLine,
  RiRobot2Line,
  RiBarChartLine,
  RiVideoLine,
} from "react-icons/ri";

const FEATURES = [
  {
    icon:  RiRoadMapLine,
    color: "text-brand-400",
    bg:    "bg-brand-500/10",
    title: "Career Roadmaps",
    desc:  "Personalized learning paths for your target role — Frontend, Backend, DevOps, Data Science & more.",
  },
  {
    icon:  RiCodeSSlashLine,
    color: "text-accent-400",
    bg:    "bg-accent-500/10",
    title: "Coding Tracker",
    desc:  "Track every LeetCode & HackerRank problem you solve. Visualize your progress across topics and difficulty.",
  },
  {
    icon:  RiRobot2Line,
    color: "text-purple-400",
    bg:    "bg-purple-500/10",
    title: "AI Mentor Chat",
    desc:  "Ask anything — DSA doubts, career advice, system design. Get instant AI-powered guidance 24/7.",
  },
  {
    icon:  RiFileTextLine,
    color: "text-yellow-400",
    bg:    "bg-yellow-500/10",
    title: "Resume Review",
    desc:  "Upload your resume and get AI feedback, ATS score, and improvement suggestions instantly.",
  },
  {
    icon:  RiBarChartLine,
    color: "text-pink-400",
    bg:    "bg-pink-500/10",
    title: "Interview Analytics",
    desc:  "Track your readiness across DSA, DBMS, OS, CN, Aptitude & HR. Know your weak spots before the interview.",
  },
  {
    icon:  RiVideoLine,
    color: "text-orange-400",
    bg:    "bg-orange-500/10",
    title: "Course Recommendations",
    desc:  "Curated YouTube resources and mini-projects for every skill in your roadmap. Learn by doing.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-24 px-4 relative">

    {/* ── Background glow ── */}
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-500/5 rounded-full blur-[100px]" />
    </div>

    <div className="max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="text-center mb-16">
        <div className="badge badge-green mx-auto mb-4">Everything You Need</div>
        <h2 className="section-title mb-4">
          Built for Serious{" "}
          <span className="text-gradient">Job Seekers</span>
        </h2>
        <p className="section-subtitle max-w-2xl mx-auto">
          All the tools you need to go from beginner to job-ready,
          in one intelligent platform.
        </p>
      </div>

      {/* ── Feature Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="card p-6 group hover:border-brand-500/30 hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl ${feat.bg} flex items-center justify-center mb-4`}>
                <Icon className={`text-xl ${feat.color}`} />
              </div>

              {/* Content */}
              <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeaturesSection;