import { Progress, Badge, TypeIcon } from "../components/UI";
import { mockChallenges } from "../data/mockData";

export default function Dashboard({ onNav, setDetailChallenge }) {
  const active = mockChallenges.filter(c => c.status === "active");

  return (
    <div className="page fade-in">
      <div className="flex items-center justify-between mb-20">
        <div>
          <div className="label mb-4">Good morning</div>
          <div className="title-xl">Maryam S. 👋</div>
        </div>
      </div>

      {/* Weekly summary */}
      <div
        className="card card-glow mb-16"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(234,88,12,0.06))" }}
      >
        <div className="accent-bar" />
        <div className="label mb-16">This Week</div>
        <div className="grid-3">
          {[
            { l: "Days Completed",    v: "5" },
            { l: "Active Challenges", v: "2" },
            { l: "Best Streak",       v: "7 🔥" },
          ].map(({ l, v }) => (
            <div key={l} className="stat-bubble">
              <div className="stat-value">{v}</div>
              <div className="label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="label mb-12">Active Challenges</div>
      <div className="flex-col gap-12">
        {active.map(c => (
          <div
            key={c.id}
            className="challenge-card"
            onClick={() => { setDetailChallenge(c); onNav("detail"); }}
          >
            <div className="accent-bar" />
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="title-sm mb-4">{c.name}</div>
                <div className="flex gap-8 items-center">
                  <span className="badge badge-active">
                    <TypeIcon type={c.type} /> {c.type}
                  </span>
                  <span className="text-xs text-muted">{c.daysLeft}d left</span>
                </div>
              </div>
              <div className="text-right">
                <div className="mono text-amber" style={{ fontSize: 15 }}>
                  {c.streak} <span className="streak-flame">🔥</span>
                </div>
                <div className="text-xs text-muted">streak</div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-8">
              <div className="text-xs text-dim">
                <span className="mono">{c.progress.toLocaleString()}</span>
                <span className="text-muted"> / {c.goal.toLocaleString()} {c.unit}</span>
              </div>
              <div className="text-xs text-dim">{Math.round(c.progress / c.goal * 100)}%</div>
            </div>
            <Progress pct={c.progress / c.goal * 100} />
            <div className="flex items-center justify-between mt-12">
              <div className="text-xs text-muted">Rank #{c.rank}</div>
              <button className="btn btn-sm btn-primary" onClick={e => e.stopPropagation()}>
                + Quick Log
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
