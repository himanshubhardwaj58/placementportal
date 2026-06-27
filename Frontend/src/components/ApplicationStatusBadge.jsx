const statusConfig = {
  applied: { label: "Applied", class: "badge-info" },
  shortlisted: { label: "Shortlisted", class: "badge-accent" },
  interview: { label: "Interview", class: "badge-warning" },
  offered: { label: "Offered", class: "badge-success" },
  rejected: { label: "Rejected", class: "badge-error" },
  accepted: { label: "Accepted", class: "badge-success" },
};

function ApplicationStatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, class: "badge-info" };
  return <span className={`badge ${config.class}`}>{config.label}</span>;
}

export default ApplicationStatusBadge;
