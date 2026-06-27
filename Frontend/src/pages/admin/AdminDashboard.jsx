import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import StatsCard from "../../components/StatsCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getDashboardStats } from "../../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner text="Loading stats..." /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of the placement portal activity</p>
      </div>

      <div className="stats-grid">
        <StatsCard icon="🎓" label="Total Students" value={stats?.totalStudents || 0} color="blue" />
        <StatsCard icon="🏢" label="Companies" value={stats?.totalCompanies || 0} color="purple" />
        <StatsCard icon="💼" label="Total Jobs" value={stats?.totalJobs || 0} color="yellow" />
        <StatsCard icon="📄" label="Applications" value={stats?.totalApplications || 0} color="green" />
      </div>

      <div className="stats-grid">
        <StatsCard icon="✅" label="Placed Students" value={stats?.placedStudents || 0} color="green" />
        <StatsCard icon="⏳" label="Unplaced Students" value={stats?.unplacedStudents || 0} color="yellow" />
        <StatsCard icon="🟢" label="Open Jobs" value={stats?.openJobs || 0} color="blue" />
        <StatsCard icon="📊" label="Placement Rate" value={`${stats?.placementRate || 0}%`} color="purple" />
      </div>

      <div className="glass-card" style={{ marginTop: "24px" }}>
        <h3 style={{ marginBottom: "16px" }}>Quick Summary</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--accent-primary-hover)", fontFamily: "var(--font-heading)" }}>
              {stats?.totalStudents || 0}
            </div>
            <p>Registered Students</p>
          </div>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--success)", fontFamily: "var(--font-heading)" }}>
              {stats?.placedStudents || 0}
            </div>
            <p>Successfully Placed</p>
          </div>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--warning)", fontFamily: "var(--font-heading)" }}>
              {stats?.totalRecruiters || 0}
            </div>
            <p>Active Recruiters</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
