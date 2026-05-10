import { Link } from "react-router-dom";
import { RiArrowRightLine, RiShieldCheckLine, RiTimeLine } from "react-icons/ri";

const CTASection = () => (
  <section className="py-24 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="relative card p-10 md:p-16 text-center overflow-hidden border-brand-500/20">

        {/* ── Glow behind card ── */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-500/15 rounded-full blur-[80px]" />
        </div>

        {/* ── Decorative top line ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent" />

        <div className="badge badge-indigo mx-auto mb-6">Limited Beta Access</div>

        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Ready to Land Your{" "}
          <span className="text-gradient">Dream Job?</span>
        </h2>

        <p className="section-subtitle mb-8 max-w-xl mx-auto">
          Join thousands of students already using SkillMentor AI to
          prepare smarter and interview with confidence.
        </p>

        {/* ── Buttons ── */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Link to="/signup" className="btn-primary px-10 py-4 text-base group">
            Start for Free — No Credit Card
            <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── Trust indicators ── */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <RiShieldCheckLine className="text-accent-400" />
            Free forever plan
          </span>
          <span className="flex items-center gap-2">
            <RiTimeLine className="text-brand-400" />
            Setup in 2 minutes
          </span>
          <span className="flex items-center gap-2">
            <RiShieldCheckLine className="text-accent-400" />
            No spam, ever
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;