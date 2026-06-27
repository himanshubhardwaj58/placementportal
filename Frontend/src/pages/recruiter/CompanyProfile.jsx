import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { getMyCompany, createCompany, updateCompany } from "../../services/companyService";

function CompanyProfile() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    name: "", description: "", website: "", industry: "", locations: "",
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await getMyCompany();
      if (res.data.company) {
        setCompany(res.data.company);
        setForm({
          name: res.data.company.name || "",
          description: res.data.company.description || "",
          website: res.data.company.website || "",
          industry: res.data.company.industry || "",
          locations: (res.data.company.locations || []).join(", "),
        });
      }
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
    if (!form.name) {
      setMessage({ type: "error", text: "Company name is required" });
      return;
    }
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const data = {
        ...form,
        locations: form.locations.split(",").map((l) => l.trim()).filter(Boolean),
      };
      if (company) {
        const res = await updateCompany(company._id, data);
        setCompany(res.data.company);
        setMessage({ type: "success", text: "Company updated!" });
      } else {
        const res = await createCompany(data);
        setCompany(res.data.company);
        setMessage({ type: "success", text: "Company created! Awaiting admin approval." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner text="Loading company..." /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Company Profile</h1>
        <p>{company ? "Manage your company information" : "Set up your company to start posting jobs"}</p>
      </div>

      {company && (
        <div style={{ marginBottom: "20px" }}>
          <span className={`badge ${company.isApproved ? "badge-success" : "badge-warning"}`}>
            {company.isApproved ? "✓ Approved" : "⏳ Pending Approval"}
          </span>
        </div>
      )}

      {message.text && (
        <div className={message.type === "success" ? "success-message" : "error-message"}>{message.text}</div>
      )}

      <div className="glass-card" style={{ maxWidth: "700px" }}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Company Name *</label>
            <input className="input-field" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Google" />
          </div>
          <div className="input-group">
            <label className="input-label">Industry</label>
            <input className="input-field" name="industry" value={form.industry} onChange={handleChange} placeholder="e.g. Technology" />
          </div>
          <div className="input-group">
            <label className="input-label">Website</label>
            <input className="input-field" name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="input-group">
            <label className="input-label">Locations (comma separated)</label>
            <input className="input-field" name="locations" value={form.locations} onChange={handleChange} placeholder="Bangalore, Mumbai, Remote" />
          </div>
          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea className="input-field" name="description" value={form.description} onChange={handleChange} placeholder="Tell us about your company..." rows="4" />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : company ? "Update Company" : "Create Company"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default CompanyProfile;
