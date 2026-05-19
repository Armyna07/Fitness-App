import { COLORS } from "../constants/theme";

// ── Avatar ────────────────────────────────────────────────────────────────────
const avatarColors = [
  ["#7c3aed","#a78bfa"],["#ea580c","#fb923c"],["#059669","#34d399"],
  ["#2563eb","#60a5fa"],["#d97706","#fbbf24"],["#db2777","#f472b6"],
];

export const Avatar = ({ name = "?", size = 30, idx = 0 }) => {
  const [bg, fg] = avatarColors[idx % avatarColors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg, ${bg}, ${fg})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: "white",
    }}>
      {name[0]?.toUpperCase()}
    </div>
  );
};

// ── Progress bar ──────────────────────────────────────────────────────────────
export const Progress = ({ pct, h = 6 }) => (
  <div className="progress-track" style={{ height: h }}>
    <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, height: h }} />
  </div>
);

// ── Toggle switch ─────────────────────────────────────────────────────────────
export const Toggle = ({ on, onChange }) => (
  <div className={`toggle-switch ${on ? "on" : ""}`} onClick={() => onChange(!on)}>
    <div className="toggle-knob" />
  </div>
);

// ── Status badge ──────────────────────────────────────────────────────────────
export const Badge = ({ status }) => {
  const map = { active: "badge-active", upcoming: "badge-upcoming", completed: "badge-completed" };
  const dot = { active: "🟢", upcoming: "🔵", completed: "⚫" };
  return <span className={`badge ${map[status]}`}>{dot[status]} {status}</span>;
};

// ── Challenge type icon ───────────────────────────────────────────────────────
export const TypeIcon = ({ type }) => (
  <>{ { steps: "👣", workout: "💪", custom: "⚡" }[type] || "⚡" }</>
);
