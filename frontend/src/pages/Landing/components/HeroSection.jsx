import { Link } from "react-router-dom";
import { RiArrowRightLine, RiPlayCircleLine } from "react-icons/ri";

// const STATS = [
//   { value: "10K+", label: "Students"       },
//   { value: "95%",  label: "Interview Rate" },
//   { value: "200+", label: "AI Questions"   },
//   { value: "50+",  label: "Roadmaps"       },
// ];

const scrollToFeatures = () => {
  const el = document.querySelector("#features");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">

      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Badge */}
      {/* <div className="animate-fade-in flex items-center gap-2 badge badge-indigo mb-6 py-1.5 px-4">
        <div className="flex">
          {[0, 1, 2, 3, 4].map((i) => (
            <RiStarFill key={i} className="text-yellow-400 text-xs" />
          ))}
        </div>
        <span>Trusted by 10,000+ students</span>
      </div> */}

      {/* Heading */}
      <h1 className="animate-slide-up delay-100 font-display text-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 max-w-5xl">
        <span className="text-white">Your AI-Powered</span>
        <br />
        <span className="text-gradient">Career Mentor</span>
      </h1>

      {/* Subheading */}
      <p className="animate-slide-up delay-200 section-subtitle text-center max-w-2xl mb-10">
        Master interviews, build skills, track progress — all guided by AI.
        From DSA practice to resume reviews, SkillMentor has everything
        you need to land your dream job.
      </p>

      {/* CTA Buttons */}
      <div className="animate-slide-up delay-300 flex flex-wrap items-center justify-center gap-4 mb-16">
        <Link to="/signup" className="btn-primary px-8 py-3.5 text-base group">
          Start for Free
          <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <button
          onClick={scrollToFeatures}
          className="btn-secondary px-8 py-3.5 text-base group"
        >
          <RiPlayCircleLine className="text-lg" />
          See How It Works
        </button>
      </div>

      {/* Stats */}
      {/* <div className="animate-slide-up delay-400 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="card p-5 text-center hover:border-brand-500/30 transition-colors"
          >
            <div className="font-display text-3xl font-bold text-gradient mb-1">
              {stat.value}
            </div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div> */}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-slow">
        <span className="text-slate-600 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-brand-500/50 to-transparent" />
      </div>

    </section>
  );
};

export default HeroSection;