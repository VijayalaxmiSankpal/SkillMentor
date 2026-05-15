import { Link } from "react-router-dom";

const LandingPage = () => (
  <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center animate-fade-in">
    <div className="badge badge-indigo mb-2">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block" />
      Now in Beta
    </div>

    <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
      <span className="text-gradient">SkillMentor</span>{" "}
      <span className="text-white">AI</span>
    </h1>

    <p className="section-subtitle max-w-xl">
      Your intelligent career & interview preparation assistant.
      Build skills, track progress, ace interviews.
    </p>

    <div className="flex gap-4 flex-wrap justify-center">
      <Link to="/signup" className="btn-primary">Get Started Free</Link>
      <Link to="/login"  className="btn-secondary">Sign In</Link>
    </div>
  </main>
);

export default LandingPage;