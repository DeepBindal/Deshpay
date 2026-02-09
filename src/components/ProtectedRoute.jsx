import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) return null;
  if (!user) return <Navigate to="/signin" />;

  const loc = useLocation();
  if (!user)
    return <Navigate to="/signin" replace state={{ from: loc.pathname }} />;
  return children;
}
