import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiMailLine, RiLockLine, RiBrainLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";

const validateForm = (email, password) => {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Enter a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const validationErrors = validateForm(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-card">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-500/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow">
              <RiBrainLine className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Skill<span className="text-gradient">Mentor</span>
            </span>
          </Link>

          <div>
            <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
              Accelerate Your
              <br />
              <span className="text-gradient">Tech Career</span>
            </h2>

            <p className="text-slate-400 leading-relaxed mb-8">
              Join thousands of students using AI-powered tools to prepare
              smarter and land their dream jobs.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-2 h-2 rounded-full bg-accent-400" />
                Personalized AI career roadmaps
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-2 h-2 rounded-full bg-accent-400" />
                Mock interviews with instant feedback
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-2 h-2 rounded-full bg-accent-400" />
                Resume review with ATS scoring
              </div>
            </div>
          </div>

          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} SkillMentor AI
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow">
              <RiBrainLine className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Skill<span className="text-gradient">Mentor</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-slate-400">Sign in to continue your journey</p>
          </div>

          <div className="flex flex-col gap-4">
            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={errors.email}
              icon={RiMailLine}
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              error={errors.password}
              icon={RiLockLine}
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-brand-400 hover:text-brand-300 text-sm transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button loading={loading} onClick={handleSubmit} fullWidth>
              Sign In
            </Button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-surface-border" />
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-surface-border" />
          </div>

          <p className="text-center text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;