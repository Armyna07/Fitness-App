import { useState } from "react";
import { registerUser } from "../api/authApi";

export default function RegisterPage({ onDone, onLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleRegister = async () => {
    try {
      const data = await registerUser({
  displayName,
  username,
  email,
  password: pass,
});

      localStorage.setItem("token", data.token);

      onDone();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card fade-in">
        <div className="text-center mb-24">
          <div style={{ fontSize: 36, marginBottom: 4 }}>💪</div>
          <div className="title-xl mb-4">Create account</div>
          <div className="text-muted">
            Join FitPulse and start your fitness journey
          </div>
        </div>

        <div className="flex-col gap-16">
          <div className="form-group">
            <label className="form-label">Username</label>

            <input
              className="form-input"
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>

            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>

            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div className="form-group">
  <label className="form-label">Display Name</label>
  <input
    className="form-input"
    type="text"
    placeholder="Your display name"
    value={displayName}
    onChange={(e) => setDisplayName(e.target.value)}
  />
</div>
          <button
            className="btn btn-purple w-full"
            style={{ justifyContent: "center", padding: "13px" }}
            onClick={handleRegister}
          >
            Create Account
          </button>

          <div className="text-center text-muted">
            Already have an account?{" "}
            <span
              className="text-purple"
              style={{ cursor: "pointer" }}
              onClick={onLogin}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}