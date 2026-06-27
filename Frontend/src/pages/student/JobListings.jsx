import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import JobCard from "../../components/JobCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { getJobs } from "../../services/jobService";

function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchJobs();
  }, [page, type]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (type) params.type = type;
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
        <h1>Job Listings</h1>
        <p>Browse and apply to available placement opportunities</p>
      </div>

      <div className="glass-card" style={{ marginBottom: "24px", padding: "16px 20px" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search jobs by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: "1 1 250px", marginBottom: 0 }}
          />
          <select
            className="input-field"
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            style={{ flex: "0 1 180px", marginBottom: 0 }}
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="internship">Internship</option>
            <option value="ppo">PPO</option>
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading jobs..." />
      ) : jobs.length > 0 ? (
        <>
          <div className="cards-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} basePath="/student" />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "32px" }}>
              <button
                className="btn btn-ghost btn-sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                ← Previous
              </button>
              <span style={{ display: "flex", alignItems: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Page {page} of {pagination.pages}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                disabled={page >= pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState icon="🔍" title="No jobs found" description="Try adjusting your search or filters" />
      )}
    </DashboardLayout>
  );
}

export default JobListings;
