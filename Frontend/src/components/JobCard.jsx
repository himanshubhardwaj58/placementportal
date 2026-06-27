import { useNavigate } from "react-router-dom";
import "./JobCard.css";

function JobCard({ job, basePath = "/student" }) {
  const navigate = useNavigate();

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return null;
    const fmt = (n) => {
      if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
      if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
      return n;
    };
    if (salary.min && salary.max) return `₹${fmt(salary.min)} - ₹${fmt(salary.max)}`;
    if (salary.min) return `₹${fmt(salary.min)}+`;
    return `Up to ₹${fmt(salary.max)}`;
  };

  const getTypeLabel = (type) => {
    const labels = { "full-time": "Full Time", internship: "Internship", ppo: "PPO" };
    return labels[type] || type;
  };

  const getTypeClass = (type) => {
    const classes = { "full-time": "badge-info", internship: "badge-warning", ppo: "badge-success" };
    return classes[type] || "badge-accent";
  };

  const daysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Expired";
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `${diff} days left`;
  };

  const company = job.company;
  const companyName = typeof company === "object" ? company.name : "Company";
  const companyLogo = typeof company === "object" ? company.logo : null;

  return (
    <div className="job-card" onClick={() => navigate(`${basePath}/jobs/${job._id}`)}>
      <span className={`badge ${getTypeClass(job.type)} job-card-type`}>
        {getTypeLabel(job.type)}
      </span>

      <div className="job-card-header">
        <div className="job-card-logo">
          {companyLogo ? (
            <img src={`http://localhost:3001${companyLogo}`} alt={companyName} />
          ) : (
            companyName[0]
          )}
        </div>
        <div>
          <div className="job-card-title">{job.title}</div>
          <div className="job-card-company">{companyName}</div>
        </div>
      </div>

      <div className="job-card-meta">
        {job.location && (
          <span className="job-card-meta-item">📍 {job.location}</span>
        )}
        {job.applicationsCount > 0 && (
          <span className="job-card-meta-item">👥 {job.applicationsCount} applied</span>
        )}
      </div>

      {job.skills?.length > 0 && (
        <div className="job-card-tags">
          {job.skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="job-card-tag">{skill}</span>
          ))}
          {job.skills.length > 4 && (
            <span className="job-card-tag">+{job.skills.length - 4}</span>
          )}
        </div>
      )}

      <div className="job-card-footer">
        <span className="job-card-salary">{formatSalary(job.salary) || "Not disclosed"}</span>
        <span className="job-card-deadline">
          {daysUntilDeadline(job.deadline) || "No deadline"}
        </span>
      </div>
    </div>
  );
}

export default JobCard;
