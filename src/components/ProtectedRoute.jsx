import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user)
    return <Navigate to="/signin" replace state={{ from: loc.pathname }} />;
  return children;
}
