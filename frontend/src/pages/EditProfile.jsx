export default function EditProfile({ onBack }) {
  return (
    <div className="page fade-in">
      <div className="page-back" onClick={onBack}>← Back to Profile</div>
      <div className="title-xl mb-20">Edit Profile</div>
      <div className="card card-glow">
        <div className="flex-col gap-16">
          <div className="text-center mb-8">
            <div
              className="profile-av"
              style={{ width: 72, height: 72, fontSize: 26, margin: "0 auto 12px" }}
            >
              M
            </div>
            <button className="btn btn-ghost btn-sm">Upload Avatar</button>
          </div>
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input className="form-input" defaultValue="Maryam S." />
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
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
