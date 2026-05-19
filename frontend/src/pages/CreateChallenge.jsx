import { useState } from "react";
import { Toggle, TypeIcon } from "../components/UI";

export default function CreateChallenge({ onBack }) {
  const [privacy, setPrivacy] = useState(false);
  const [type, setType] = useState("steps");

  return (
    <div className="page fade-in">
      <div className="page-back" onClick={onBack}>← Back</div>
      <div className="title-xl mb-20">New Challenge</div>
      <div className="card card-glow">
        <div className="flex-col gap-16">
          <div className="form-group">
            <label className="form-label">Challenge Name</label>
            <input className="form-input" placeholder="e.g. 30-Day Steps Streak" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              placeholder="What's the challenge about?"
              style={{ resize: "vertical", minHeight: 80 }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="chip-row">
              {["steps", "workout", "custom"].map(t => (
                <div
                  key={t}
                  className={`chip ${type === t ? "active" : ""}`}
                  onClick={() => setType(t)}
                >
                  <TypeIcon type={t} /> {t}
                </div>
              ))}
            </div>
          </div>
          <div className="input-row">
            <div className="form-group">
              <label className="form-label">Goal Value</label>
              <input className="form-input" type="number" placeholder="10000" />
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <input className="form-input" placeholder="steps / min / reps" />
            </div>
          </div>
          <div className="input-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-input" type="date" />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-input" type="date" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Max Participants (optional)</label>
            <input className="form-input" type="number" placeholder="Unlimited" />
          </div>
          <div className="toggle-row">
            <div>
              <div className="text-sm font-600">Private Challenge</div>
              <div className="text-xs text-muted">Invite-only via link</div>
            </div>
            <Toggle on={privacy} onChange={setPrivacy} />
          </div>
          <div className="divider" />
          <div className="flex gap-12">
            <button
              className="btn btn-ghost flex-1"
              style={{ justifyContent: "center" }}
              onClick={onBack}
            >
              Cancel
            </button>
            <button
              className="btn btn-amber flex-1"
              style={{ justifyContent: "center" }}
              onClick={onBack}
            >
              Create ✦
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
