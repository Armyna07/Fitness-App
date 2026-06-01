import { useEffect, useState } from 'react';
import { Badge } from '../components/UI';
import { COLORS } from '../constants/theme';
import { getMe, getMyHistory } from '../api/userApi';
 
export default function ProfilePage({ onEdit, onLogout }) {
  const [user, setUser]       = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const load = async () => {
      try {
        const [me, hist] = await Promise.all([getMe(), getMyHistory()]);
        setUser(me);
        setHistory(hist);
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
 
  if (loading) return <div className='page fade-in'><div className='text-muted'>Loading profile...</div></div>;
 
  const initials = (user?.displayName || user?.username || 'U').charAt(0).toUpperCase();
 
  return (
    <div className='page fade-in'>
      <div className='title-xl mb-20'>Profile</div>
      <div className='profile-header mb-16'>
        <div className='profile-banner' />
        <div className='profile-av'>{initials}</div>
        <div style={{position:'relative',zIndex:1}}>
          <div className='title-lg mb-4'>{user?.displayName || user?.username}</div>
          <div className='text-muted mb-12'>{user?.email}</div>
          <div className='flex gap-8'>
            <button className='btn btn-ghost btn-sm' onClick={onEdit}>Edit Profile</button>
            <button className='btn btn-ghost btn-sm' style={{color:'#ef4444'}} onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>
 
      <div className='grid-3 mb-16'>
        {[
          { l: 'Challenges Won',   v: `${user?.challengesWon || 0} 🏆` },
          { l: 'Total Joined',     v: user?.challengesParticipated || 0 },
          { l: 'Best Streak',      v: `${Math.max(0, ...history.map(h => h.bestStreak || 0))} 🔥` },
        ].map(({ l, v }) => (
          <div key={l} className='card text-center'>
            <div className='stat-value' style={{fontSize:22}}>{v}</div>
            <div className='label mt-8'>{l}</div>
          </div>
        ))}
      </div>
 
      <div className='label mb-12'>Challenge History</div>
      <div className='flex-col' style={{gap:10}}>
        {history.length === 0 && (
          <div className='empty-state'>
            <div className='empty-icon'>🏁</div>
            <div className='text-dim'>No challenges yet</div>
          </div>
        )}
        {history.map(h => (
          <div key={h._id || h.challenge?._id} className='challenge-card' style={{cursor:'default'}}>
            <div className='flex items-center justify-between'>
              <div>
                <div className='title-sm mb-4'>{h.challenge?.name}</div>
                <div className='flex gap-8'>
                  <Badge status={h.challenge?.status} />
                  <span className='text-xs text-muted'>
                    {h.challenge?.startDate ? new Date(h.challenge.startDate).toLocaleDateString() : ''} –{' '}
                    {h.challenge?.endDate   ? new Date(h.challenge.endDate).toLocaleDateString()   : ''}
                  </span>
                </div>
              </div>
              {h.rankSnapshot && (
                <div className='mono' style={{fontSize:20,
                  color: h.rankSnapshot===1?COLORS.gold:h.rankSnapshot===2?COLORS.silver:COLORS.bronze}}>
                  #{h.rankSnapshot}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}