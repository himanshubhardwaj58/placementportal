import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import StatsCard from "../../components/StatsCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { getMyJobs } from "../../services/jobService";
import { getMyCompany } from "../../services/companyService";

function RecruiterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, companyRes] = await Promise.all([
        getMyJobs(),
        getMyCompany(),
      ]);
      setJobs(jobsRes.data.jobs || []);
      setCompany(companyRes.data.company);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalApplications = jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);
  const openJobs = jobs.filter((j) => j.status === "open").length;

  if (loading) {
    return <DashboardLayout><LoadingSpinner text="Loading dashboard..." /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Recruiter Dashboard</h1>
        <p>Manage your job postings and review applications</p>
      </div>

      {!company && (
        <div className="glass-card" style={{ marginBottom: "24px", textAlign: "center", padding: "32px" }}>
          <h3 style={{ marginBottom: "8px" }}>Set Up Your Company</h3>
          <p style={{ marginBottom: "16px" }}>Create a company profile before posting jobs</p>
          <button className="btn btn-primary" onClick={() => navigate("/recruiter/company")}>
            Create Company Profile
          </button>
        </div>
      )}

      <div className="stats-grid">
        <StatsCard icon="💼" label="Jobs Posted" value={jobs.length} color="blue" />
        <StatsCard icon="🟢" label="Open Positions" value={openJobs} color="green" />
        <StatsCard icon="👥" label="Total Applications" value={totalApplications} color="purple" />
        <StatsCard icon="🏢" label="Company Status" value={company?.isApproved ? "Approved" : "Pending"} color={company?.isApproved ? "green" : "yellow"} />
      </div>

      <h2 style={{ marginBottom: "16px" }}>Your Job Postings</h2>
      {jobs.length > 0 ? (
        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Applications</th>
                <th>Status</th>
                <th>Posted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td style={{ color: "var(--text-heading)", fontWeight: 500 }}>{job.title}</td>
                  <td><span className="badge badge-info" style={{ textTransform: "capitalize" }}>{job.type}</span></td>
                  <td>{job.applicationsCount || 0}</td>
                  <td>
                    <span className={`badge ${job.status === "open" ? "badge-success" : "badge-error"}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/recruiter/jobs/${job._id}/applications`)}>
                      View Apps
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="📝" title="No jobs posted" description="Post your first job to start receiving applications" />
      )}
    </DashboardLayout>
  );
}

export default RecruiterDashboard;
