import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    const roleRedirects = {
      student: "/student/dashboard",
      recruiter: "/recruiter/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={roleRedirects[user?.role] || "/"} replace />;
  }

  return children;
}

export default RoleRoute;
