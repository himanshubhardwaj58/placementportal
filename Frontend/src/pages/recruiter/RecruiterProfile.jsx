import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/authService";

function RecruiterProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", designation: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        designation: user.designation || "",
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await updateProfile(form);
      updateUser(res.data.user);
      setMessage({ type: "success", text: "Profile updated!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      {message.text && (
        <div className={message.type === "success" ? "success-message" : "error-message"}>{message.text}</div>
      )}

      <div className="glass-card" style={{ maxWidth: "500px" }}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Name</label>
            <input className="input-field" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input className="input-field" value={user?.email || ""} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="input-group">
            <label className="input-label">Phone</label>
            <input className="input-field" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Designation</label>
            <input className="input-field" name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. HR Manager" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default RecruiterProfile;
