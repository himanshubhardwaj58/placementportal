import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getNotifications, markAllAsRead } from "../services/notificationService";
import "./Navbar.css";

function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await getNotifications({ limit: 1 });
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      // silent fail
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const profilePath = `/${user?.role}/profile`;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onToggleSidebar} aria-label="Toggle menu">
          ☰
        </button>
        <span className="navbar-greeting">
          Welcome, <strong>{user?.name || "User"}</strong>
        </span>
      </div>

      <div className="navbar-right">
        <button
          className="navbar-notification-btn"
          onClick={() => navigate(`/${user?.role}/notifications`)}
          aria-label="Notifications"
        >
          🔔
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <div className="navbar-user" ref={dropdownRef} onClick={() => setShowDropdown(!showDropdown)}>
          <div className="navbar-avatar">
            {user?.avatar ? (
              <img src={`http://localhost:3001${user.avatar}`} alt={user.name} />
            ) : (
              getInitials(user?.name)
            )}
          </div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">{user?.name}</span>
            <span className="navbar-user-role">{user?.role}</span>
          </div>

          {showDropdown && (
            <div className="navbar-dropdown">
              <button className="navbar-dropdown-item" onClick={() => { navigate(profilePath); setShowDropdown(false); }}>
                👤 Profile
              </button>
              <div className="navbar-dropdown-divider" />
              <button className="navbar-dropdown-item danger" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
