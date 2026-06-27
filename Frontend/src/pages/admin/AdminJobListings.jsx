import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import JobCard from "../../components/JobCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { getJobs } from "../../services/jobService";

function AdminJobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchJobs();
  }, [page, status]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (status) params.status = status;
      else delete params.status; // show all for admin
      const res = await getJobs(params);
      setJobs(res.data.jobs || []);
      setPagination(res.data.pagination || { total: 0, pages: 1 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>All Jobs</h1>
        <p>View and manage all job listings</p>
      </div>

      <div className="glass-card" style={{ marginBottom: "24px", padding: "16px 20px" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="text" className="input-field" placeholder="Search..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ flex: "1 1 250px", marginBottom: 0 }}
          />
          <select className="input-field" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} style={{ flex: "0 1 150px", marginBottom: 0 }}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="filled">Filled</option>
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {loading ? <LoadingSpinner /> : jobs.length > 0 ? (
        <>
          <div className="cards-grid">
            {jobs.map((job) => <JobCard key={job._id} job={job} basePath="/admin" />)}
          </div>
          {pagination.pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "32px" }}>
              <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button>
              <span style={{ display: "flex", alignItems: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>{page} / {pagination.pages}</span>
              <button className="btn btn-ghost btn-sm" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next →</button>
            </div>
          )}
        </>
      ) : <EmptyState icon="💼" title="No jobs found" />}
    </DashboardLayout>
  );
}

export default AdminJobListings;
