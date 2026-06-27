import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import StatsCard from "../../components/StatsCard";
import JobCard from "../../components/JobCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { getJobs } from "../../services/jobService";
import { getMyApplications } from "../../services/applicationService";

function StudentDashboard() {
  const { user } = useAuth();
  const [recentJobs, setRecentJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        getJobs({ limit: 4 }),
        getMyApplications(),
      ]);
      setRecentJobs(jobsRes.data.jobs || []);
      setApplications(appsRes.data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalApplied: applications.length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    interviews: applications.filter((a) => a.status === "interview").length,
    offers: applications.filter((a) => ["offered", "accepted"].includes(a.status)).length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Welcome, {user?.name?.split(" ")[0]} 👋</h1>
        <p>Here's an overview of your placement activity</p>
      </div>

      <div className="stats-grid">
        <StatsCard icon="📄" label="Applications" value={stats.totalApplied} color="blue" />
        <StatsCard icon="⭐" label="Shortlisted" value={stats.shortlisted} color="purple" />
        <StatsCard icon="🎤" label="Interviews" value={stats.interviews} color="yellow" />
        <StatsCard icon="🎉" label="Offers" value={stats.offers} color="green" />
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ marginBottom: "16px" }}>Recent Job Openings</h2>
        {recentJobs.length > 0 ? (
          <div className="cards-grid">
            {recentJobs.map((job) => (
              <JobCard key={job._id} job={job} basePath="/student" />
            ))}
          </div>
        ) : (
          <EmptyState icon="💼" title="No jobs posted yet" description="Check back soon for new openings" />
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentDashboard;
