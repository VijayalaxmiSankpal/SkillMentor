import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RiMailLine,
  RiLockLine,
  RiUserLine,
  RiBrainLine,
} from "react-icons/ri";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";

const validateForm = (name, email, password, confirm) => {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Enter a valid email";
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (password !== confirm) {
    errors.confirm = "Passwords do not match";
  }

  return errors;
};

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const validationErrors = validateForm(
      name,
      email,
      password,
      confirm
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await authService.register(name, email, password);

      toast.success(
        "Account created successfully! Please login."
      );

      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Signup failed. Please try again.";

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
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[80px]" />
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
              Start Your
              <br />
              <span className="text-gradient">Success Story</span>
            </h2>

            <p className="text-slate-400 leading-relaxed mb-8">
              Build the skills you need, track your progress,
              and land the job you deserve — all in one place.
            </p>

            {/* <div className="grid grid-cols-2 gap-4">
              <div className="card p-4 border-brand-500/20">
                <div className="font-display text-2xl font-bold text-gradient mb-1">
                  10K+
                </div>
                <div className="text-slate-400 text-sm">
                  Active Students
                </div>
              </div>

              <div className="card p-4 border-accent-500/20">
                <div className="font-display text-2xl font-bold text-accent-400 mb-1">
                  95%
                </div>
                <div className="text-slate-400 text-sm">
                  Interview Rate
                </div>
              </div>

              <div className="card p-4 border-brand-500/20">
                <div className="font-display text-2xl font-bold text-gradient mb-1">
                  200+
                </div>
                <div className="text-slate-400 text-sm">
                  AI Questions
                </div>
              </div>

              <div className="card p-4 border-accent-500/20">
                <div className="font-display text-2xl font-bold text-accent-400 mb-1">
                  50+
                </div>
                <div className="text-slate-400 text-sm">
                  Roadmaps
                </div>
              </div>
            </div>*/}
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
              Create your account
            </h1>

            <p className="text-slate-400">
              Free forever. No credit card required.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <FormInput
              label="Full Name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              error={errors.name}
              icon={RiUserLine}
            />

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
              placeholder="Min. 6 characters"
              error={errors.password}
              icon={RiLockLine}
            />

            <FormInput
              label="Confirm Password"
              type="password"
              name="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              error={errors.confirm}
              icon={RiLockLine}
            />

            <Button
              loading={loading}
              onClick={handleSubmit}
              fullWidth
            >
              Create Account
            </Button>

            <p className="text-center text-slate-500 text-xs leading-relaxed">
              By signing up, you agree to our Terms of Service
              and Privacy Policy.
            </p>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-surface-border" />
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-surface-border" />
          </div>

          <p className="text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;