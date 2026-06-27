import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getPlacementStats } from "../../services/adminService";

function PlacementStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getPlacementStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner text="Loading analytics..." /></DashboardLayout>;

  const departmentStats = stats?.departmentStats || [];
  const companyStats = stats?.companyStats || [];
  const monthlyTrend = stats?.monthlyTrend || [];

  const maxDeptTotal = Math.max(...departmentStats.map((d) => d.total), 1);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Placement Statistics</h1>
        <p>Detailed analytics on placement performance</p>
      </div>

      {/* Department-wise Stats */}
      <div className="glass-card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "20px" }}>Department-wise Placements</h3>
        {departmentStats.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No department data available</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {departmentStats.map((dept) => (
              <div key={dept._id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{dept._id}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {dept.placed} / {dept.total} placed ({dept.total > 0 ? ((dept.placed / dept.total) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div style={{ height: "8px", background: "var(--bg-tertiary)", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(dept.total / maxDeptTotal) * 100}%`,
                      background: "var(--bg-input)",
                      borderRadius: "4px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: dept.total > 0 ? `${(dept.placed / dept.total) * 100}%` : "0%",
                        background: "var(--accent-gradient)",
                        borderRadius: "4px",
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Top Companies */}
        <div className="glass-card">
          <h3 style={{ marginBottom: "16px" }}>Top Hiring Companies</h3>
          {companyStats.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No data yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {companyStats.map((c, i) => (
                <div key={c._id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", background: "var(--bg-input)", borderRadius: "var(--radius-md)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "24px", height: "24px", borderRadius: "50%",
                      background: i < 3 ? "var(--accent-gradient)" : "var(--bg-tertiary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.7rem", fontWeight: 700, color: "#fff",
                    }}>{i + 1}</span>
                    <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{c._id}</span>
                  </div>
                  <span className="badge badge-success">{c.offers} offers</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="glass-card">
          <h3 style={{ marginBottom: "16px" }}>Monthly Applications</h3>
          {monthlyTrend.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No trend data yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {monthlyTrend.map((m) => {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const maxCount = Math.max(...monthlyTrend.map((t) => t.count), 1);
                return (
                  <div key={`${m._id.year}-${m._id.month}`} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", minWidth: "70px" }}>
                      {months[m._id.month - 1]} {m._id.year}
                    </span>
                    <div style={{ flex: 1, height: "6px", background: "var(--bg-tertiary)", borderRadius: "3px" }}>
                      <div style={{
                        height: "100%", width: `${(m.count / maxCount) * 100}%`,
                        background: "var(--accent-gradient)", borderRadius: "3px",
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, minWidth: "30px", textAlign: "right" }}>{m.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PlacementStats;
