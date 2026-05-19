import { Badge } from "../components/UI";
import { mockChallenges } from "../data/mockData";
import { COLORS } from "../constants/theme";

export default function ProfilePage({ onEdit }) {
  return (
    <div className="page fade-in">
      <div className="title-xl mb-20">Profile</div>

      <div className="profile-header mb-16">
        <div className="profile-banner" />
        <div className="profile-av">M</div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="title-lg mb-4">Maryam S.</div>
          <div className="text-muted mb-12">maryam@example.com</div>
          <button className="btn btn-ghost btn-sm" onClick={onEdit}>Edit Profile</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3 mb-16">
        {[
          { l: "Challenges Won", v: "4 🏆" },
          { l: "Total Joined",   v: "12"   },
          { l: "Best Streak",    v: "14 🔥" },
        ].map(({ l, v }) => (
          <div key={l} className="card text-center">
            <div className="stat-value" style={{ fontSize: 22 }}>{v}</div>
            <div className="label mt-8">{l}</div>
          </div>
        ))}
      </div>

      {/* History */}
      <div className="label mb-12">Challenge History</div>
      <div className="flex-col" style={{ gap: 10 }}>
        {mockChallenges
          .filter(c => c.status === "completed" || c.status === "active")
          .map(c => (
            <div key={c.id} className="challenge-card" style={{ cursor: "default" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="title-sm mb-4">{c.name}</div>
                  <div className="flex gap-8">
                    <Badge status={c.status} />
                    <span className="text-xs text-muted">{c.start} – {c.end}</span>
                  </div>
                </div>
                {c.rank && (
                  <div
                    className="mono"
                    style={{
                      fontSize: 20,
                      color: c.rank === 1 ? COLORS.gold : c.rank === 2 ? COLORS.silver : COLORS.bronze,
                    }}
                  >
                    #{c.rank}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
