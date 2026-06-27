function LoadingSpinner({ size = 36, text = "" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "40px" }}>
      <div className="spinner" style={{ width: size, height: size }} />
      {text && <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
