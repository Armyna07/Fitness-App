export default function Navbar({ activeTab, onNav, onProfile, onGo404, onGoArchive, user }) {
  const initials = user?.displayName?.[0]?.toUpperCase()
    || user?.username?.[0]?.toUpperCase()
    || '?';

  return (
    <nav className="top-nav">
      <div className="nav-logo">💓 FitPulse</div>

      <div className="nav-tabs">
        {[
          { key: "home",        label: "Home" },
          { key: "challenges",  label: "Challenges" },
          { key: "leaderboard", label: "Leaderboard" },
          { key: "friends",     label: "Friends" },
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
        <div className="nav-avatar" onClick={onProfile}>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
            />
          ) : null}
          <span style={{ display: user?.avatar ? 'none' : 'block' }}>{initials}</span>
        </div>
      </div>
    </nav>
  );
}
