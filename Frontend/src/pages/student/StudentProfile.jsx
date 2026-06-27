import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { API_BASE } from "../../config";
import { updateProfile, uploadResume } from "../../services/authService";

function StudentProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "", phone: "", department: "", year: "", cgpa: "",
    batch: "", rollNumber: "", skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        department: user.department || "",
        year: user.year || "",
        cgpa: user.cgpa || "",
        batch: user.batch || "",
        rollNumber: user.rollNumber || "",
        skills: (user.skills || []).join(", "),
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const data = {
        ...form,
        year: form.year ? Number(form.year) : undefined,
        cgpa: form.cgpa ? Number(form.cgpa) : undefined,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const res = await updateProfile(data);
      updateUser(res.data.user);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setMessage({ type: "error", text: "Only PDF files are allowed" });
      return;
    }
    setResumeLoading(true);
    try {
      const res = await uploadResume(file);
      updateUser(res.data.user);
      setMessage({ type: "success", text: "Resume uploaded!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Upload failed" });
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal and academic information</p>
      </div>

      {message.text && (
        <div className={message.type === "success" ? "success-message" : "error-message"}>
          {message.text}
        </div>
      )}

      <div className="glass-card" style={{ maxWidth: "700px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input className="input-field" name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Phone</label>
              <input className="input-field" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
            </div>
            <div className="input-group">
              <label className="input-label">Roll Number</label>
              <input className="input-field" name="rollNumber" value={form.rollNumber} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Department</label>
              <input className="input-field" name="department" value={form.department} onChange={handleChange} placeholder="e.g. Computer Science" />
            </div>
            <div className="input-group">
              <label className="input-label">Year</label>
              <input className="input-field" name="year" type="number" min="1" max="5" value={form.year} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">CGPA</label>
              <input className="input-field" name="cgpa" type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={handleChange} />
            </div>
            <div className="input-group" style={{ gridColumn: "1 / -1" }}>
              <label className="input-label">Batch</label>
              <input className="input-field" name="batch" value={form.batch} onChange={handleChange} placeholder="e.g. 2024-2028" />
            </div>
            <div className="input-group" style={{ gridColumn: "1 / -1" }}>
              <label className="input-label">Skills (comma separated)</label>
              <input className="input-field" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, Python, ..." />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border-primary)" }}>
          <h3 style={{ marginBottom: "12px" }}>Resume</h3>
          {user?.resumeUrl ? (
            <p style={{ fontSize: "0.85rem", marginBottom: "12px" }}>
              📄 Current:{" "}
               <a href={`${API_BASE}${user.resumeUrl}`} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            </p>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "12px" }}>
              No resume uploaded yet
            </p>
          )}
          <label className="btn btn-secondary" style={{ cursor: "pointer" }}>
            {resumeLoading ? "Uploading..." : "Upload Resume (PDF)"}
            <input type="file" accept=".pdf" onChange={handleResumeUpload} style={{ display: "none" }} disabled={resumeLoading} />
          </label>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentProfile;
