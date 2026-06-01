import { useState, useEffect, useCallback } from 'react';
import { css } from './constants/theme';

import FriendsPage     from './pages/FriendsPage';
import Navbar          from './components/Navbar';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import JoinPreviewPage from './pages/JoinPreviewPage';
import Dashboard       from './pages/Dashboard';
import ChallengeList   from './pages/ChallengeList';
import CreateChallenge from './pages/CreateChallenge';
import ChallengeDetail from './pages/ChallengeDetail';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage     from './pages/ProfilePage';
import EditProfile     from './pages/EditProfile';
import NotFound        from './pages/NotFound';

export default function App() {
  const [auth,    setAuth]    = useState(false);
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));
  const [page,         setPage]         = useState('login');
  const [activeTab,    setActiveTab]    = useState('home');
  const [detailChallenge, setDetailChallenge] = useState(null);
  const [showCreate,   setShowCreate]   = useState(false);

  // Fetch + cache the current user
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // API returns either { user } or the user object directly
        setUser(data.user || data);
      }
    } catch (err) {
      console.error('fetchUser error:', err);
    }
  }, []);

  // On mount: validate stored token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || data);
          setAuth(true);
          setPage('dashboard');
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = (userData) => {
    if (userData) setUser(userData);
    else fetchUser();
    setAuth(true);
    setPage('dashboard');
    setActiveTab('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    setUser(null);
    setPage('login');
    setActiveTab('home');
  };

  const navTo = (tab) => {
    setActiveTab(tab);
    if (tab === 'home')        setPage('dashboard');
    if (tab === 'challenges')  setPage('challenges');
    if (tab === 'leaderboard') setPage('leaderboard');
    if (tab === 'friends')     setPage('friends');
    if (tab === 'profile')     setPage('profile');
  };

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div className='nav-logo'>💓 FitPulse</div>
        </div>
      </>
    );
  }

  const renderPage = () => {
    if (!auth) {
      if (page === 'register') return <RegisterPage onDone={handleLogin} onLogin={() => setPage('login')} />;
      if (page === 'join')     return <JoinPreviewPage onJoin={handleLogin} onBack={() => setPage('login')} />;
      return <LoginPage onLogin={handleLogin} onRegister={() => setPage('register')} />;
    }
    if (showCreate) return (
      <CreateChallenge onBack={() => setShowCreate(false)} />
    );
    if (page === 'detail' && detailChallenge) return (
      <ChallengeDetail challenge={detailChallenge} onBack={() => setPage('challenges')} />
    );
    if (page === 'editProfile') return (
      <EditProfile
        onBack={() => {
          fetchUser(); // re-fetch user so avatar + name update everywhere
          setPage('profile');
        }}
      />
    );
    if (page === 'archived')    return <LeaderboardPage archived />;
    if (page === '404')         return <NotFound onHome={() => { setPage('dashboard'); setActiveTab('home'); }} />;
    if (page === 'challenges')  return <ChallengeList onNav={p => setPage(p)} setDetailChallenge={setDetailChallenge} setShowCreate={setShowCreate} />;
    if (page === 'leaderboard') return <LeaderboardPage />;
    if (page === 'profile')     return <ProfilePage user={user} onEdit={() => setPage('editProfile')} onLogout={handleLogout} />;
    if (page === 'friends')     return <FriendsPage />;
    return <Dashboard onNav={p => setPage(p)} setDetailChallenge={setDetailChallenge} />;
  };

  return (
    <>
      <style>{css}</style>
      <div className='nebula' style={{width:400,height:400,top:-100,left:-100,background:'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)'}} />
      <div className='nebula' style={{width:300,height:300,top:200,right:-60,background:'radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 70%)'}} />
      <div className='nebula' style={{width:500,height:500,bottom:-200,left:'30%',background:'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)'}} />
      <div className='noise-overlay' />
      <div className='app-shell'>
        {auth && (
          <Navbar
            activeTab={activeTab}
            onNav={navTo}
            onProfile={() => navTo('profile')}
            onGo404={() => setPage('404')}
            onGoArchive={() => setPage('archived')}
            user={user}
          />
        )}
        {!auth && <div style={{position:'fixed',top:16,left:24,zIndex:100}}><div className='nav-logo'>💓 FitPulse</div></div>}
        {!auth && (
          <div style={{position:'fixed',top:16,right:24,zIndex:100,display:'flex',gap:8}}>
            <button className='btn btn-ghost btn-sm' onClick={() => setPage('register')}>Register</button>
          </div>
        )}
        {renderPage()}
      </div>
    </>
  );
}
