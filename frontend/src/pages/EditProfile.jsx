import { useState, useEffect } from "react";
import { getMe } from "../api/userApi";
import API from "../api/axios";

export default function EditProfile({ onBack }) {
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl,   setAvatarUrl]   = useState("");
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState(false);

  useEffect(() => {
    getMe()
      .then(user => {
        setDisplayName(user.displayName || user.username || "");
        setAvatarUrl(user.avatar || "");
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess(false);

    if (!displayName.trim()) return setError("Display name cannot be empty.");
    if (avatarUrl && !/^https?:\/\/.+/.test(avatarUrl))
      return setError("Avatar must be a valid URL (starting with http:// or https://).");

    setSaving(true);
    try {
      await API.patch("/users/me", {
        displayName: displayName.trim(),
        ...(avatarUrl ? { avatar: avatarUrl.trim() } : {}),
      });
      setSuccess(true);
      setTimeout(onBack, 900);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const initials = displayName?.[0]?.toUpperCase() || "?";

  if (loading) return (
    <div className="page fade-in">
      <div className="page-back" onClick={onBack}>← Back to Profile</div>
      <div className="text-muted">Loading...</div>
    </div>
  );

  return (
    <div className="page fade-in">
      <div className="page-back" onClick={onBack}>← Back to Profile</div>
      <div className="title-xl mb-20">Edit Profile</div>

      <div className="card card-glow">
        <div className="flex-col gap-16">

          {/* Avatar preview */}
          <div className="text-center mb-8">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar"
                style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", margin: "0 auto 12px", display: "block", border: "2px solid rgba(245,158,11,0.3)" }}
                onError={() => setAvatarUrl("")} />
            ) : (
              <div className="profile-av"
                style={{ width: 72, height: 72, fontSize: 26, margin: "0 auto 12px" }}>
                {initials}
              </div>
            )}
          </div>

          {/* Avatar URL input */}
          <div className="form-group">
            <label className="form-label">Avatar URL</label>
            <input className="form-input"
              placeholder="https://example.com/avatar.png"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)} />
            <div className="text-xs text-muted mt-8">Paste a direct image URL — it will preview above</div>
          </div>

          <div className="form-group">
            <label className="form-label">Display Name *</label>
            <input className="form-input"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)} />
          </div>

          {error && (
            <div style={{ color: "#ef4444", fontSize: 13 }}>{error}</div>
          )}
          {success && (
            <div style={{ color: "#10b981", fontSize: 13 }}>✓ Profile updated!</div>
          )}

          <div className="divider" />

          <div className="flex gap-12">
            <button className="btn btn-ghost flex-1" style={{ justifyContent: "center" }}
              onClick={onBack} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-amber flex-1" style={{ justifyContent: "center" }}
              onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
