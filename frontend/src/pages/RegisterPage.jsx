export default function RegisterPage({ onDone, onLogin }) {
  return (
    <div className="auth-wrap">
      <div className="auth-card fade-in">
        <div className="text-center mb-24">
          <div style={{ fontSize: 36, marginBottom: 4 }}>⚡</div>
          <div className="title-xl mb-4">Create account</div>
          <div className="text-muted">Join the challenge community</div>
        </div>
        <div className="flex-col" style={{ gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Display name</label>
            <input className="form-input" placeholder="Your name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input className="form-input" type="password" placeholder="••••••••" />
          </div>
          <button
            className="btn btn-amber w-full"
            style={{ justifyContent: "center", padding: "13px", marginTop: 4 }}
            onClick={onDone}
          >
            Create account
          </button>
          <div className="text-center text-muted">
            Already have an account?{" "}
            <span className="text-purple" style={{ cursor: "pointer" }} onClick={onLogin}>
              Sign in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
