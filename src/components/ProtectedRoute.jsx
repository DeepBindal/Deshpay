import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/signin",
}) {
  const { user, loading } = useAuthStore();
  const loc = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: loc.pathname }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    const fallback = user.role === "ADMIN" ? "/admin/users" : "/";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
