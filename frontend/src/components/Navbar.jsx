export default function Navbar({ activeTab, onNav, onProfile, onLogout, onGo404, onGoArchive }) {
  return (
    <nav className="top-nav">
      <div className="nav-logo">💓 FitPulse</div>

      <div className="nav-tabs">
        {[
          { key: "home",        label: "Home" },
          { key: "challenges",  label: "Challenges" },
          { key: "leaderboard", label: "Leaderboard" },
          { key: 'friends',     label: 'Friends' },   
          { key: "profile",     label: "Profile" },
        ].map(t => (
          <button
            key={t.key}
            className={`nav-tab ${activeTab === t.key ? "active" : ""}`}
            onClick={() => onNav(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-12">
        <span className="text-xs text-muted" style={{ cursor: "pointer" }} onClick={onGo404}>404</span>
        <span className="text-xs text-muted" style={{ cursor: "pointer" }} onClick={onGoArchive}>Archive</span>
        <div className="nav-avatar" onClick={onProfile}>M</div>
      </div>
    </nav>
  );
}
