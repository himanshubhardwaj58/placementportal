import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import ApplicationStatusBadge from "../../components/ApplicationStatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { getJobApplications, updateApplicationStatus } from "../../services/applicationService";
import { getJobById } from "../../services/jobService";

function ManageApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchData();
  }, [jobId, filterStatus]);

  const fetchData = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        getJobById(jobId),
        getJobApplications(jobId, filterStatus ? { status: filterStatus } : {}),
      ]);
      setJob(jobRes.data.job);
      setApplications(appsRes.data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner text="Loading applications..." /></DashboardLayout>;

  return (
    <DashboardLayout>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      <div className="page-header">
        <h1>Applications for: {job?.title}</h1>
        <p>{applications.length} total applications</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {["", "applied", "shortlisted", "interview", "offered", "rejected"].map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${filterStatus === s ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilterStatus(s)}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {applications.length === 0 ? (
        <EmptyState icon="👥" title="No applications" description="No applications match the current filter" />
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Department</th>
                <th>CGPA</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td style={{ color: "var(--text-heading)", fontWeight: 500 }}>{app.student?.name}</td>
                  <td>{app.student?.email}</td>
                  <td>{app.student?.department || "—"}</td>
                  <td>{app.student?.cgpa || "—"}</td>
                  <td>
                    {app.student?.resumeUrl ? (
                      <a href={`http://localhost:3001${app.student.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                        View
                      </a>
                    ) : "—"}
                  </td>
                  <td><ApplicationStatusBadge status={app.status} /></td>
                  <td>
                    <select
                      className="input-field"
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      style={{ padding: "6px 10px", fontSize: "0.78rem", minWidth: "120px" }}
                    >
                      <option value="applied">Applied</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview">Interview</option>
                      <option value="offered">Offered</option>
                      <option value="rejected">Rejected</option>
                      <option value="accepted">Accepted</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageApplications;
