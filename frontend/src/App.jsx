import { useState } from "react";
import { css } from "./constants/theme";
import { mockChallenges } from "./data/mockData";

import FriendsPage     from './pages/FriendsPage';
import Navbar          from "./components/Navbar";
import LoginPage       from "./pages/LoginPage";
import RegisterPage    from "./pages/RegisterPage";
import JoinPreviewPage from "./pages/JoinPreviewPage";
import Dashboard       from "./pages/Dashboard";
import ChallengeList   from "./pages/ChallengeList";
import CreateChallenge from "./pages/CreateChallenge";
import ChallengeDetail from "./pages/ChallengeDetail";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage     from "./pages/ProfilePage";
import EditProfile     from "./pages/EditProfile";
import NotFound        from "./pages/NotFound";

export default function App() {
  const [auth, setAuth]                       = useState(false);
  const [page, setPage]                       = useState("login");
  const [activeTab, setActiveTab]             = useState("home");
  const [detailChallenge, setDetailChallenge] = useState(mockChallenges[0]);
  const [showCreate, setShowCreate]           = useState(false);

  const handleLogin = () => {
    setAuth(true);
    setPage("dashboard");
    setActiveTab("home");
  };

  const navTo = (tab) => {
    setActiveTab(tab);
    if (tab === "home")        setPage("dashboard");
    if (tab === "challenges")  setPage("challenges");
    if (tab === "leaderboard") setPage("leaderboard");
    if (tab === 'friends')     setPage('friends');   
    if (tab === "profile")     setPage("profile");
  };

  const renderPage = () => {
    if (!auth) {
      if (page === "register") return <RegisterPage onDone={handleLogin} onLogin={() => setPage("login")} />;
      if (page === "join")     return <JoinPreviewPage challenge={mockChallenges[0]} onJoin={handleLogin} onBack={() => setPage("login")} />;
      return <LoginPage onLogin={handleLogin} onRegister={() => setPage("register")} />;
    }
    if (showCreate)           return <CreateChallenge onBack={() => setShowCreate(false)} />;
    if (page === "detail")    return <ChallengeDetail challenge={detailChallenge} onBack={() => setPage("challenges")} />;
    if (page === "editProfile") return <EditProfile onBack={() => setPage("profile")} />;
    if (page === "archived")  return <LeaderboardPage archived />;
    if (page === "404")       return <NotFound onHome={() => { setPage("dashboard"); setActiveTab("home"); }} />;
    if (page === "challenges")  return <ChallengeList onNav={p => setPage(p)} setDetailChallenge={setDetailChallenge} setShowCreate={setShowCreate} />;
    if (page === "leaderboard") return <LeaderboardPage />;
    if (page === "profile")     return <ProfilePage onEdit={() => setPage("editProfile")} />;
    if (page === 'friends') return <FriendsPage />;
    return <Dashboard onNav={p => setPage(p)} setDetailChallenge={setDetailChallenge} />;
  };

  return (
    <>
      <style>{css}</style>

      {/* Nebula background blobs */}
      <div className="nebula" style={{ width: 400, height: 400, top: -100,  left: -100, background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
      <div className="nebula" style={{ width: 300, height: 300, top: 200,   right: -60, background: "radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 70%)" }} />
      <div className="nebula" style={{ width: 500, height: 500, bottom: -200, left: "30%", background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }} />
      <div className="noise-overlay" />

      <div className="app-shell">
        {/* Authenticated navbar */}
        {auth && (
          <Navbar
            activeTab={activeTab}
            onNav={navTo}
            onProfile={() => navTo("profile")}
            onGo404={() => setPage("404")}
            onGoArchive={() => setPage("archived")}
          />
        )}

        {/* Pre-auth logo + buttons */}
        {!auth && (
          <div style={{ position: "fixed", top: 16, left: 24, zIndex: 100 }}>
            <div className="nav-logo">💓 FitPulse</div>
          </div>
        )}
        {!auth && (
          <div style={{ position: "fixed", top: 16, right: 24, zIndex: 100, display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage("register")}>Register</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage("join")}>Preview Join</button>
          </div>
        )}

        {renderPage()}
      </div>
    </>
  );
}

