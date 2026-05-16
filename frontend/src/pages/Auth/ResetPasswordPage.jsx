import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  RiLockLine,
  RiBrainLine,
  RiArrowLeftLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";

const validatePasswords = (password, confirm) => {
  const errors = {};

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (password !== confirm) {
    errors.confirm = "Passwords do not match";
  }

  return errors;
};

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async () => {
    const validationErrors = validatePasswords(password, confirm);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!token) {
      toast.error("Invalid or expired reset link.");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await authService.resetPassword(token, password);
      setDone(true);
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      const msg = err?.response?.data?.message || "Reset failed. Try again.";
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
          {done ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-accent-500/15 flex items-center justify-center">
                <RiCheckboxCircleLine className="text-accent-400 text-4xl" />
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">
                  Password Reset!
                </h2>
                <p className="text-slate-400 text-sm">
                  Your password has been updated successfully. Redirecting you
                  to login...
                </p>
              </div>

              <Link to="/login" className="btn-primary w-full mt-2">
                Go to Sign In
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h1 className="font-display text-2xl font-bold text-white mb-2">
                  Reset your password
                </h1>
                <p className="text-slate-400 text-sm">
                  Enter your new password below.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <FormInput
                  label="New Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  error={errors.password}
                  icon={RiLockLine}
                />

                <FormInput
                  label="Confirm New Password"
                  type="password"
                  name="confirm"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  error={errors.confirm}
                  icon={RiLockLine}
                />

                <Button loading={loading} onClick={handleSubmit} fullWidth>
                  Reset Password
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

export default ResetPasswordPage;