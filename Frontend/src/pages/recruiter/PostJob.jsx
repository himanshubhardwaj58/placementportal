import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { createJob } from "../../services/jobService";
import { getMyCompany } from "../../services/companyService";

function PostJob() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    title: "", description: "", type: "full-time", location: "",
    salaryMin: "", salaryMax: "", minCGPA: "", departments: "",
    batch: "", skills: "", deadline: "",
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await getMyCompany();
      setCompany(res.data.company);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setMessage({ type: "error", text: "Title and description are required" });
      return;
    }
    if (!company || !company.isApproved) {
      setMessage({ type: "error", text: "Your company must be approved first" });
      return;
    }

    setPosting(true);
    setMessage({ type: "", text: "" });
    try {
      const data = {
        title: form.title,
        description: form.description,
        type: form.type,
        location: form.location,
        companyId: company._id,
        salary: {
          min: form.salaryMin ? Number(form.salaryMin) : 0,
          max: form.salaryMax ? Number(form.salaryMax) : 0,
        },
        eligibility: {
          minCGPA: form.minCGPA ? Number(form.minCGPA) : 0,
          departments: form.departments.split(",").map((d) => d.trim()).filter(Boolean),
          batch: form.batch,
        },
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        deadline: form.deadline || undefined,
      };
      await createJob(data);
      setMessage({ type: "success", text: "Job posted successfully!" });
      setTimeout(() => navigate("/recruiter/dashboard"), 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to post" });
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <DashboardLayout><div className="loading-page"><div className="spinner" /></div></DashboardLayout>;

  if (!company) {
    return (
      <DashboardLayout>
        <div className="glass-card" style={{ textAlign: "center", padding: "40px" }}>
          <h2>Create a Company First</h2>
          <p style={{ margin: "12px 0 20px" }}>You need a company profile before posting jobs</p>
          <button className="btn btn-primary" onClick={() => navigate("/recruiter/company")}>Go to Company Setup</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Post a New Job</h1>
        <p>Create a job listing for {company.name}</p>
      </div>

      {message.text && (
        <div className={message.type === "success" ? "success-message" : "error-message"}>{message.text}</div>
      )}

      <div className="glass-card" style={{ maxWidth: "750px" }}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Job Title *</label>
            <input className="input-field" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Software Engineer" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <div className="input-group">
              <label className="input-label">Job Type</label>
              <select className="input-field" name="type" value={form.type} onChange={handleChange}>
                <option value="full-time">Full Time</option>
                <option value="internship">Internship</option>
                <option value="ppo">PPO</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Location</label>
              <input className="input-field" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore" />
            </div>
            <div className="input-group">
              <label className="input-label">Min Salary (₹)</label>
              <input className="input-field" name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Max Salary (₹)</label>
              <input className="input-field" name="salaryMax" type="number" value={form.salaryMax} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Min CGPA Required</label>
              <input className="input-field" name="minCGPA" type="number" step="0.1" min="0" max="10" value={form.minCGPA} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Batch</label>
              <input className="input-field" name="batch" value={form.batch} onChange={handleChange} placeholder="e.g. 2024-2028" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Eligible Departments (comma separated)</label>
            <input className="input-field" name="departments" value={form.departments} onChange={handleChange} placeholder="CS, IT, ECE, ..." />
          </div>
          <div className="input-group">
            <label className="input-label">Required Skills (comma separated)</label>
            <input className="input-field" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, ..." />
          </div>
          <div className="input-group">
            <label className="input-label">Application Deadline</label>
            <input className="input-field" name="deadline" type="date" value={form.deadline} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Job Description *</label>
            <textarea className="input-field" name="description" value={form.description} onChange={handleChange} rows="6" placeholder="Describe the role, responsibilities, requirements..." />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={posting} style={{ width: "100%" }}>
            {posting ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default PostJob;
