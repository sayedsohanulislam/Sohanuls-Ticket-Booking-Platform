import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Spinner from "./Spinner.jsx";

/**
 * Guards a route so only authenticated users can access it.
 * Optionally pass `roles` to restrict to specific roles.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, loading, isAuthed } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner label="Authenticating…" />;
  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
