import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import JobListings from "./pages/student/JobListings";
import JobDetail from "./pages/student/JobDetail";
import MyApplications from "./pages/student/MyApplications";

// Recruiter Pages
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CompanyProfile from "./pages/recruiter/CompanyProfile";
import PostJob from "./pages/recruiter/PostJob";
import ManageApplications from "./pages/recruiter/ManageApplications";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCompanies from "./pages/admin/ManageCompanies";
import PlacementStats from "./pages/admin/PlacementStats";
import AdminJobListings from "./pages/admin/AdminJobListings";

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  const redirects = {
    student: "/student/dashboard",
    recruiter: "/recruiter/dashboard",
    admin: "/admin/dashboard",
  };
  return <Navigate to={redirects[user.role] || "/student/dashboard"} replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Auth ── */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />

          {/* ── Student ── */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute><RoleRoute allowedRoles={["student"]}><StudentDashboard /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute><RoleRoute allowedRoles={["student"]}><StudentProfile /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/student/jobs" element={
            <ProtectedRoute><RoleRoute allowedRoles={["student"]}><JobListings /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/student/jobs/:id" element={
            <ProtectedRoute><RoleRoute allowedRoles={["student"]}><JobDetail /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/student/applications" element={
            <ProtectedRoute><RoleRoute allowedRoles={["student"]}><MyApplications /></RoleRoute></ProtectedRoute>
          } />

          {/* ── Recruiter ── */}
          <Route path="/recruiter/dashboard" element={
            <ProtectedRoute><RoleRoute allowedRoles={["recruiter"]}><RecruiterDashboard /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/recruiter/company" element={
            <ProtectedRoute><RoleRoute allowedRoles={["recruiter"]}><CompanyProfile /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/recruiter/post-job" element={
            <ProtectedRoute><RoleRoute allowedRoles={["recruiter"]}><PostJob /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/recruiter/jobs/:jobId/applications" element={
            <ProtectedRoute><RoleRoute allowedRoles={["recruiter"]}><ManageApplications /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/recruiter/profile" element={
            <ProtectedRoute><RoleRoute allowedRoles={["recruiter"]}><RecruiterProfile /></RoleRoute></ProtectedRoute>
          } />

          {/* ── Admin ── */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><RoleRoute allowedRoles={["admin"]}><AdminDashboard /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute><RoleRoute allowedRoles={["admin"]}><ManageUsers /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/admin/companies" element={
            <ProtectedRoute><RoleRoute allowedRoles={["admin"]}><ManageCompanies /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/admin/stats" element={
            <ProtectedRoute><RoleRoute allowedRoles={["admin"]}><PlacementStats /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/admin/jobs" element={
            <ProtectedRoute><RoleRoute allowedRoles={["admin"]}><AdminJobListings /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/admin/jobs/:id" element={
            <ProtectedRoute><RoleRoute allowedRoles={["admin"]}><JobDetail /></RoleRoute></ProtectedRoute>
          } />
          <Route path="/admin/profile" element={
            <ProtectedRoute><RoleRoute allowedRoles={["admin"]}><RecruiterProfile /></RoleRoute></ProtectedRoute>
          } />

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;