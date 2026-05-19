export default function NotFound({ onHome }) {
  return (
    <div
      className="page fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
      }}
    >
      <div className="not-found-number">404</div>
      <div className="title-lg mb-8" style={{ marginTop: -8 }}>Page not found</div>
      <div className="text-muted mb-20">Looks like you wandered off the track.</div>
      <button className="btn btn-primary" onClick={onHome}>← Back to Dashboard</button>
    </div>
  );
}
