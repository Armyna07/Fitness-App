import { Badge, TypeIcon } from "../components/UI";

export default function JoinPreviewPage({ challenge, onJoin, onBack }) {
  return (
    <div className="page fade-in" style={{ maxWidth: 560 }}>
      <div className="page-back" onClick={onBack}>← Back</div>
      <div className="card card-glow">
        <div className="accent-bar" />
        <div className="label mb-8">Challenge Invite</div>
        <div className="title-xl mb-4">{challenge.name}</div>
        <div className="flex gap-8 items-center mb-20">
          <span className="badge badge-upcoming">
            <TypeIcon type={challenge.type} /> {challenge.type}
          </span>
          <Badge status={challenge.status} />
        </div>
        <div className="grid-2 gap-16 mb-20">
          {[
            { l: "Goal",         v: `${challenge.goal.toLocaleString()} ${challenge.unit}` },
            { l: "Participants", v: challenge.participants },
            { l: "Start",        v: challenge.start },
            { l: "End",          v: challenge.end },
          ].map(({ l, v }) => (
            <div key={l} className="card" style={{ padding: "14px 16px" }}>
              <div className="label mb-4">{l}</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="text-dim mb-20">{challenge.description}</div>
        <button
          className="btn btn-amber w-full"
          style={{ justifyContent: "center", padding: "13px" }}
          onClick={onJoin}
        >
          Join Challenge
        </button>
      </div>
    </div>
  );
}
