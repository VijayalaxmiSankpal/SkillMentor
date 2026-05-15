import { Link } from "react-router-dom";

const ResetPasswordPage = () => (
  <main className="flex items-center justify-center min-h-screen p-4">
    <div className="card p-8 w-full max-w-md text-center">
      <h2 className="font-display text-2xl font-bold text-white mb-2">Reset Password</h2>
      <p className="text-slate-400 text-sm mb-6">Auth UI coming in Step 3</p>
      <Link to="/login" className="btn-ghost">← Back to Login</Link>
    </div>
  </main>
);
export default ResetPasswordPage;