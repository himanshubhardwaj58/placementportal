import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { getJobById } from "../../services/jobService";
import { applyToJob } from "../../services/applicationService";
import { API_BASE } from "../../config";

function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await getJobById(id);
      setJob(res.data.job);
    } catch (err) {
      setMessage({ type: "error", text: "Job not found" });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user?.resumeUrl) {
      setMessage({ type: "error", text: "Please upload your resume before applying" });
      return;
    }
    setApplying(true);
    try {
      await applyToJob(id);
      setMessage({ type: "success", text: "Application submitted successfully! 🎉" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to apply" });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <DashboardLayout><LoadingSpinner text="Loading job details..." /></DashboardLayout>;
  }

  if (!job) {
    return <DashboardLayout><div className="error-message">Job not found</div></DashboardLayout>;
  }

  const company = job.company;
  const salary = job.salary;
  const eligibility = job.eligibility;

  const formatSalary = () => {
    if (!salary?.min && !salary?.max) return "Not disclosed";
    const fmt = (n) => n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n;
    if (salary.min && salary.max) return `₹${fmt(salary.min)} - ₹${fmt(salary.max)} ${salary.currency || "INR"}`;
    return salary.min ? `₹${fmt(salary.min)}+` : `Up to ₹${fmt(salary.max)}`;
  };

  return (
    <DashboardLayout>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      {message.text && (
        <div className={message.type === "success" ? "success-message" : "error-message"}>{message.text}</div>
      )}

      <div className="glass-card" style={{ maxWidth: "800px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "24px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "var(--radius-md)",
            background: "var(--bg-tertiary)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1.5rem", fontWeight: "700",
            color: "var(--accent-primary-hover)", flexShrink: 0, overflow: "hidden"
          }}>
            {company?.logo ? (
               <img src={`${API_BASE}${company.logo}`} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (company?.name?.[0] || "C")}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{job.title}</h1>
            <p style={{ color: "var(--text-muted)" }}>{company?.name} {job.location ? `• ${job.location}` : ""}</p>
          </div>
          <span className={`badge ${job.type === "full-time" ? "badge-info" : job.type === "internship" ? "badge-warning" : "badge-success"}`}>
            {job.type === "full-time" ? "Full Time" : job.type === "internship" ? "Internship" : "PPO"}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>Salary</div>
            <div style={{ fontWeight: "600", color: "var(--success)" }}>{formatSalary()}</div>
          </div>
          <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>Min CGPA</div>
            <div style={{ fontWeight: "600" }}>{eligibility?.minCGPA || "None"}</div>
          </div>
          <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>Applicants</div>
            <div style={{ fontWeight: "600" }}>{job.applicationsCount || 0}</div>
          </div>
          <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>Deadline</div>
            <div style={{ fontWeight: "600" }}>{job.deadline ? new Date(job.deadline).toLocaleDateString() : "Open"}</div>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "10px" }}>Description</h3>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>{job.description}</p>
        </div>

        {job.skills?.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "10px" }}>Required Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {job.skills.map((skill, i) => (
                <span key={i} className="badge badge-accent">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {eligibility?.departments?.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "10px" }}>Eligible Departments</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {eligibility.departments.map((dept, i) => (
                <span key={i} className="badge badge-info">{dept}</span>
              ))}
            </div>
          </div>
        )}

        {user?.role === "student" && job.status === "open" && (
          <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid var(--border-primary)" }}>
            <button className="btn btn-primary btn-lg" onClick={handleApply} disabled={applying} style={{ width: "100%" }}>
              {applying ? "Submitting..." : "Apply Now"}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default JobDetail;
