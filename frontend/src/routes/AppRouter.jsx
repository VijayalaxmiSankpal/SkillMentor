/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CoursesPage from "../pages/Courses/CoursesPage";
import NotesPage from "../pages/Notes/NotesPage";
import CodingTrackerPage from "../pages/CodingTracker/CodingTrackerPage";
import InterviewPrepPage from "../pages/InterviewPrep/InterviewPrepPage";
import MockInterviewPage from "../pages/MockInterview/MockInterviewPage";
import AIMentorPage from "../pages/AIMentor/AIMentorPage";
import QuestionGeneratorPage from "../pages/QuestionGenerator/QuestionGeneratorPage";
import ResumeReviewPage from "../pages/ResumeReview/ResumeReviewPage";
import NotFoundPage from "../components/shared/errors/NotFoundPage";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import LandingPage from "../pages/Landing/LandingPage";

import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import RoadmapPage from "../pages/Roadmap/RoadmapPage";

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
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/coding-tracker" element={<CodingTrackerPage />} />
          <Route path="/interview-prep" element={<InterviewPrepPage />} />
          <Route path="/mock-interview" element={<MockInterviewPage />} />
          <Route path="/ai-mentor" element={<AIMentorPage />} />
          <Route path="/question-generator" element={<QuestionGeneratorPage />} />
          <Route path="/resume-review" element={<ResumeReviewPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;