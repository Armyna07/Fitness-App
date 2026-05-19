import { useState } from "react";

export default function LoginPage({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="auth-wrap">
      <div className="auth-card fade-in">
        <div className="text-center mb-24">
          <div style={{ fontSize: 36, marginBottom: 4 }}>🔥</div>
          <div className="title-xl mb-4">Welcome back</div>
          <div className="text-muted">Sign in to your FitPulse account</div>
        </div>
        <div className="flex-col gap-16">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>
          <button
            className="btn btn-amber w-full"
            style={{ justifyContent: "center", padding: "13px" }}
            onClick={onLogin}
          >
            Sign in
          </button>
          <div className="text-center text-muted">
            Don't have an account?{" "}
            <span className="text-purple" style={{ cursor: "pointer" }} onClick={onRegister}>
              Register
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
