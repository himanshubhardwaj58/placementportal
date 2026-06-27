import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { getCompanies, approveCompany } from "../../services/companyService";

function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, [filter]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = filter !== "" ? { approved: filter } : {};
      const res = await getCompanies(params);
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, isApproved) => {
    try {
      await approveCompany(id, isApproved);
      setCompanies((prev) => prev.map((c) => (c._id === id ? { ...c, isApproved } : c)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Manage Companies</h1>
        <p>Approve or reject company registrations</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {[
          { label: "All", value: "" },
          { label: "Pending", value: "false" },
          { label: "Approved", value: "true" },
        ].map((opt) => (
          <button
            key={opt.value}
            className={`btn btn-sm ${filter === opt.value ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading companies..." />
      ) : companies.length === 0 ? (
        <EmptyState icon="🏢" title="No companies found" />
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Website</th>
                <th>Registered By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c._id}>
                  <td style={{ color: "var(--text-heading)", fontWeight: 500 }}>{c.name}</td>
                  <td>{c.industry || "—"}</td>
                  <td>
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem" }}>
                        Visit ↗
                      </a>
                    ) : "—"}
                  </td>
                  <td>{c.createdBy?.name || "—"}</td>
                  <td>
                    <span className={`badge ${c.isApproved ? "badge-success" : "badge-warning"}`}>
                      {c.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: "6px" }}>
                    {!c.isApproved && (
                      <button className="btn btn-sm btn-primary" onClick={() => handleApproval(c._id, true)}>
                        Approve
                      </button>
                    )}
                    {c.isApproved && (
                      <button className="btn btn-sm btn-ghost" onClick={() => handleApproval(c._id, false)}>
                        Revoke
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

export default ManageCompanies;
