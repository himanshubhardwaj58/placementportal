import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ApplicationStatusBadge from "../../components/ApplicationStatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { getMyApplications, withdrawApplication } from "../../services/applicationService";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getMyApplications();
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    try {
      await withdrawApplication(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to withdraw");
    }
  };

  if (loading) {
    return <DashboardLayout><LoadingSpinner text="Loading applications..." /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of your job applications</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState icon="📋" title="No applications yet" description="Start applying to jobs to see them here" />
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Type</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td style={{ color: "var(--text-heading)", fontWeight: 500 }}>
                    {app.job?.title || "N/A"}
                  </td>
                  <td>{app.job?.company?.name || "N/A"}</td>
                  <td>
                    <span className="badge badge-info" style={{ textTransform: "capitalize" }}>
                      {app.job?.type || "N/A"}
                    </span>
                  </td>
                  <td><ApplicationStatusBadge status={app.status} /></td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    {app.status === "applied" && (
                      <button className="btn btn-ghost btn-sm" onClick={() => handleWithdraw(app._id)}>
                        Withdraw
                      </button>
                    )}
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

export default MyApplications;
