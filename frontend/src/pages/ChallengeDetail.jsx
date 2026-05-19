import { useState } from "react";
import { Avatar, Progress, Badge, TypeIcon } from "../components/UI";
import { heatmapData } from "../data/mockData";
import { COLORS } from "../constants/theme";

export default function ChallengeDetail({ challenge, onBack }) {
  const [copied, setCopied] = useState(false);
  const goalMet = challenge.progress >= challenge.goal;
  const pct = Math.min(challenge.progress / challenge.goal * 100, 100);

  return (
    <div className="page fade-in">
      <div className="page-back" onClick={onBack}>← Back to Challenges</div>

      {/* Header */}
      <div className="card card-glow mb-16">
        <div className="accent-bar" />
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="label mb-4">Challenge</div>
            <div className="title-xl">{challenge.name}</div>
          </div>
          <Badge status={challenge.status} />
        </div>
        <div className="flex gap-8 mb-16">
          <span className="badge badge-amber">
            <TypeIcon type={challenge.type} /> {challenge.type}
          </span>
          <span className="badge badge-upcoming">🏁 {challenge.daysLeft}d left</span>
          {challenge.rank && (
            <span
              className="badge"
              style={{
                background: "rgba(251,191,36,0.1)",
                color: COLORS.gold,
                border: "1px solid rgba(251,191,36,0.2)",
              }}
            >
              🏆 Rank #{challenge.rank}
            </span>
          )}
        </div>

        <div className="label mb-8">Today's Progress</div>
        <div className="flex items-center justify-between mb-6">
          <span className="mono text-amber">
            {challenge.progress.toLocaleString()}{" "}
            <span className="text-muted text-sm">/ {challenge.goal.toLocaleString()} {challenge.unit}</span>
          </span>
          {goalMet && <span className="badge badge-active">✓ Goal Met!</span>}
        </div>
        <Progress pct={pct} h={8} />
      </div>

      {/* Leaderboard preview */}
      <div className="card mb-16">
        <div className="flex items-center justify-between mb-16">
          <div className="label">Leaderboard</div>
          <span className="text-xs text-purple" style={{ cursor: "pointer" }}>View full →</span>
        </div>
        <div className="podium">
          {[
            { slot: 2, name: "Maryam S.", color: COLORS.silver, h: "podium-2" },
            { slot: 1, name: "Alex K.",   color: COLORS.gold,   h: "podium-1" },
            { slot: 3, name: "Jordan L.", color: COLORS.bronze, h: "podium-3" },
          ].map((p, i) => (
            <div key={p.slot} className="podium-slot">
              <Avatar name={p.name} size={34} idx={i} />
              <div className={`podium-block ${p.h}`}>{p.slot}</div>
              <div className="podium-name">{p.name.split(" ")[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="card mb-16">
        <div className="label mb-12">Activity Calendar — May</div>
        <div className="heatmap-grid">
          {heatmapData.map(d => (
            <div
              key={d.day}
              className={`heatmap-cell ${d.hit ? "hit" : "miss"} ${d.today ? "today" : ""}`}
              title={`Day ${d.day}`}
            />
          ))}
        </div>
        <div className="flex gap-12 mt-12" style={{ fontSize: 11, color: COLORS.textMuted }}>
          <span>■ <span style={{ color: COLORS.purpleLight }}>Completed</span></span>
          <span>■ <span style={{ color: "#ef4444" }}>Missed</span></span>
          <span>□ Future</span>
        </div>
      </div>

      {/* Invite */}
      <div className="card mb-16">
        <div className="label mb-12">Invite Friends</div>
        <div className="share-box mb-10">
          <span className="share-code">FIT-{challenge.id}X7</span>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          >
            {copied ? "✓ Copied" : "Copy Code"}
          </button>
        </div>
        <div className="share-box">
          <span
            className="text-xs text-muted mono"
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            fitpulse.app/join/FIT-{challenge.id}X7
          </span>
          <button className="btn btn-sm btn-ghost">Copy Link</button>
        </div>
      </div>

      <button className="btn btn-danger btn-sm">Leave Challenge</button>
    </div>
  );
}
