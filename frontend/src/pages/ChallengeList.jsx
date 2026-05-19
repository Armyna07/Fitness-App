import { useState } from "react";
import { Badge, TypeIcon } from "../components/UI";
import { mockChallenges } from "../data/mockData";
import { COLORS } from "../constants/theme";

export default function ChallengeList({ onNav, setDetailChallenge, setShowCreate }) {
  const [tab, setTab] = useState("active");
  const filtered = mockChallenges.filter(c => c.status === tab);

  return (
    <div className="page fade-in">
      <div className="flex items-center justify-between mb-20">
        <div className="title-xl">Challenges</div>
      </div>

      <div className="tab-row">
        {["active", "upcoming", "completed"].map(t => (
          <button
            key={t}
            className={`tab-pill ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-col gap-12">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏁</div>
            <div className="text-dim">No {tab} challenges yet</div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
              Create one
            </button>
          </div>
        ) : filtered.map(c => (
          <div
            key={c.id}
            className="challenge-card"
            onClick={() => { setDetailChallenge(c); onNav("detail"); }}
          >
            <div className="accent-bar" />
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="title-sm mb-4">{c.name}</div>
                <div className="flex gap-8 items-center">
                  <Badge status={c.status} />
                  <span className="badge badge-amber">
                    <TypeIcon type={c.type} /> {c.type}
                  </span>
                </div>
              </div>
              {c.rank && (
                <div className="text-right">
                  <div
                    className="mono"
                    style={{
                      fontSize: 20,
                      color: c.rank === 1 ? COLORS.gold : c.rank === 2 ? COLORS.silver : COLORS.bronze,
                    }}
                  >
                    #{c.rank}
                  </div>
                  <div className="text-xs text-muted">rank</div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-muted">
              <span>{c.participants} participants</span>
              {c.status === "active"    && <span>{c.daysLeft} days left</span>}
              {c.status === "upcoming"  && <span>Starts {c.start}</span>}
              {c.status === "completed" && <span>Ended {c.end}</span>}
            </div>
          </div>
        ))}
      </div>

      <button className="fab" onClick={() => setShowCreate(true)}>＋</button>
    </div>
  );
}
