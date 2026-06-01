import { useState } from "react";
import { Toggle, TypeIcon } from "../components/UI";
import { createChallenge } from "../api/challengeApi";

export default function CreateChallenge({ onBack }) {
  const [privacy,      setPrivacy]      = useState(false);
  const [type,         setType]         = useState("steps");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const [form, setForm] = useState({
    name:            "",
    description:     "",
    goalValue:       "",
    unit:            "",
    startDate:       "",
    endDate:         "",
    maxParticipants: "",
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleCreate = async () => {
    setError("");

    // Basic front-end validation
    if (!form.name.trim())      return setError("Challenge name is required.");
    if (!form.goalValue)        return setError("Goal value is required.");
    if (!form.startDate)        return setError("Start date is required.");
    if (!form.endDate)          return setError("End date is required.");

    const start = new Date(form.startDate);
    const end   = new Date(form.endDate);
    if (end <= start)           return setError("End date must be after start date.");

    setLoading(true);
    try {
      await createChallenge({
        name:            form.name.trim(),
        description:     form.description.trim(),
        type,
        goalValue:       Number(form.goalValue),
        unit:            form.unit.trim() || (type === "steps" ? "steps" : "reps"),
        startDate:       form.startDate,
        endDate:         form.endDate,
        visibility:      privacy ? "private" : "public",
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
      });
      onBack();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Failed to create challenge.");
    } finally {
      setLoading(false);
    }
  };

  // Set sensible unit placeholder based on type
  const unitPlaceholder = { steps: "steps", workout: "minutes", custom: "reps" }[type] || "units";

  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="page fade-in">
      <div className="page-back" onClick={onBack}>← Back</div>
      <div className="title-xl mb-20">New Challenge</div>

      {error && (
        <div className="card mb-16" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: 13 }}>
          {error}
        </div>
      )}

      <div className="card card-glow">
        <div className="flex-col gap-16">

          <div className="form-group">
            <label className="form-label">Challenge Name *</label>
            <input className="form-input" placeholder="e.g. 30-Day Steps Streak"
              value={form.name} onChange={e => set("name", e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input"
              placeholder="What's the challenge about?"
              style={{ resize: "vertical", minHeight: 80 }}
              value={form.description} onChange={e => set("description", e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Type *</label>
            <div className="chip-row">
              {["steps", "workout", "custom"].map(t => (
                <div key={t} className={`chip ${type === t ? "active" : ""}`}
                  onClick={() => setType(t)}>
                  <TypeIcon type={t} /> {t}
                </div>
              ))}
            </div>
          </div>

          <div className="input-row">
            <div className="form-group">
              <label className="form-label">Goal Value *</label>
              <input className="form-input" type="number" placeholder="10000" min="1"
                value={form.goalValue} onChange={e => set("goalValue", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <input className="form-input" placeholder={unitPlaceholder}
                value={form.unit} onChange={e => set("unit", e.target.value)} />
            </div>
          </div>

          <div className="input-row">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input className="form-input" type="date" min={today}
                value={form.startDate} onChange={e => set("startDate", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input className="form-input" type="date" min={form.startDate || today}
                value={form.endDate} onChange={e => set("endDate", e.target.value)} />
            </div>
          </div>

          {/* Live duration preview */}
          {form.startDate && form.endDate && new Date(form.endDate) > new Date(form.startDate) && (
            <div className="text-xs text-muted" style={{ marginTop: -8 }}>
              ⏱ Duration: {Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))} days
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Max Participants (optional)</label>
            <input className="form-input" type="number" placeholder="Unlimited" min="2"
              value={form.maxParticipants} onChange={e => set("maxParticipants", e.target.value)} />
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
            <button className="btn btn-ghost flex-1" style={{ justifyContent: "center" }}
              onClick={onBack} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-amber flex-1" style={{ justifyContent: "center" }}
              onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "Create ✦"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
