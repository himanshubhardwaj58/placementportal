import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const navItems = {
  student: [
    { section: "Main", items: [
      { path: "/student/dashboard", icon: "📊", label: "Dashboard" },
      { path: "/student/jobs", icon: "💼", label: "Job Listings" },
      { path: "/student/applications", icon: "📋", label: "My Applications" },
    ]},
    { section: "Account", items: [
      { path: "/student/profile", icon: "👤", label: "My Profile" },
    ]},
  ],
  recruiter: [
    { section: "Main", items: [
      { path: "/recruiter/dashboard", icon: "📊", label: "Dashboard" },
      { path: "/recruiter/post-job", icon: "➕", label: "Post a Job" },
    ]},
    { section: "Manage", items: [
      { path: "/recruiter/company", icon: "🏢", label: "Company Profile" },
    ]},
    { section: "Account", items: [
      { path: "/recruiter/profile", icon: "👤", label: "My Profile" },
    ]},
  ],
  admin: [
    { section: "Overview", items: [
      { path: "/admin/dashboard", icon: "📊", label: "Dashboard" },
      { path: "/admin/stats", icon: "📈", label: "Placement Stats" },
    ]},
    { section: "Manage", items: [
      { path: "/admin/users", icon: "👥", label: "Users" },
      { path: "/admin/companies", icon: "🏢", label: "Companies" },
      { path: "/admin/jobs", icon: "💼", label: "All Jobs" },
    ]},
    { section: "Account", items: [
      { path: "/admin/profile", icon: "👤", label: "My Profile" },
    ]},
  ],
};

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const sections = navItems[user?.role] || [];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">P</div>
          <div className="sidebar-brand-text">
            <h3>PlacementPortal</h3>
            <span>College Placement Cell</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div key={section.section}>
              <div className="sidebar-section-label">{section.section}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={onClose}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-link" style={{ cursor: "default", opacity: 0.6, fontSize: "0.75rem" }}>
            <span className="sidebar-link-icon">⚡</span>
            PlacementPortal v1.0
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
