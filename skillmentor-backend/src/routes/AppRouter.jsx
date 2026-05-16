import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Pages — Landing
import LandingPage from "../pages/Landing/LandingPage";

// Pages — Auth
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";

// Pages — Dashboard
import DashboardPage from "../pages/Dashboard/DashboardPage";

// Placeholder
function ComingSoon(props) {
  const title = props.title;
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-slate-400 font-display text-2xl">{title} — Coming Soon</p>
    </div>
  );
}

// ── Protected Route Guard ─────────────────────
function ProtectedRoute(props) {
  const children = props.children;
  const auth = useAuth();
  const user = auth.user;
  const loading = auth.loading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-brand-400 animate-pulse">Loading...</span>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" replace />;
}

// ── Public Route Guard ──────────────────────────
function PublicRoute(props) {
  const children = props.children;
  const auth = useAuth();
  const user = auth.user;
  const loading = auth.loading;

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public / Landing ── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* ── Auth Pages ── */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

        {/* ── Protected Dashboard ── */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/roadmap" element={<ComingSoon title="Career Roadmap" />} />
          <Route path="/courses" element={<ComingSoon title="Courses" />} />
          <Route path="/notes" element={<ComingSoon title="Notes" />} />
          <Route path="/coding-tracker" element={<ComingSoon title="Coding Tracker" />} />
          <Route path="/interview-prep" element={<ComingSoon title="Interview Prep" />} />
          <Route path="/mock-interview" element={<ComingSoon title="Mock Interview" />} />
          <Route path="/ai-mentor" element={<ComingSoon title="AI Mentor" />} />
          <Route path="/question-generator" element={<ComingSoon title="Question Generator" />} />
          <Route path="/resume-review" element={<ComingSoon title="Resume Review" />} />
        </Route>

        {/* ── 404 Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;