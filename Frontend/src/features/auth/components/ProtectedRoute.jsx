import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) return <main className="auth-loading">Loading your InstaVerse...</main>;
  if (!user) return <Navigate to="/register" replace state={{ from: location.pathname }} />;
  return children;
};

export default ProtectedRoute;
