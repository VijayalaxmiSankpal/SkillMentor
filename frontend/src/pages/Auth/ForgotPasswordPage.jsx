import { useState } from "react";
import { Link } from "react-router-dom";
import {
  RiMailLine,
  RiBrainLine,
  RiArrowLeftLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent to your email!");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-brand-500/8 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow">
            <RiBrainLine className="text-white text-xl" />
          </div>
          <span className="font-display font-bold text-xl text-white">
            Skill<span className="text-gradient">Mentor</span>
          </span>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-accent-500/15 flex items-center justify-center">
                <RiCheckboxCircleLine className="text-accent-400 text-4xl" />
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">
                  Check your email
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We sent a password reset link to
                </p>
                <p className="text-brand-300 font-semibold text-sm mt-1">
                  {email}
                </p>
              </div>

              <p className="text-slate-500 text-xs">
                Didn't receive it? Check your spam folder or try again.
              </p>

              <button
                onClick={() => setSent(false)}
                className="btn-secondary w-full mt-2"
              >
                Try another email
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h1 className="font-display text-2xl font-bold text-white mb-2">
                  Forgot password?
                </h1>
                <p className="text-slate-400 text-sm">
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  error={error}
                  icon={RiMailLine}
                />

                <Button loading={loading} onClick={handleSubmit} fullWidth>
                  Send Reset Link
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <Link
            to="/login"
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <RiArrowLeftLine />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;