import "./StatsCard.css";

function StatsCard({ icon, label, value, color = "blue", trend }) {
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className={`stats-card-icon ${color}`}>{icon}</div>
        {trend && (
          <span className={`stats-card-trend ${trend > 0 ? "up" : "down"}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stats-card-value">{value}</div>
      <div className="stats-card-label">{label}</div>
    </div>
  );
}

export default StatsCard;
