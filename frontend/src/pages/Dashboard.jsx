import { useEffect, useState,  } from 'react';
import { Progress, TypeIcon } from '../components/UI';
import { getMyChallenges, submitLog, getMyLogs } from '../api/challengeApi';
import { getMe } from '../api/userApi';

export default function Dashboard({ onNav, setDetailChallenge }) {
  const [active,     setActive]     = useState([]);
  const [user,       setUser]       = useState(null);
  const [logsMap,    setLogsMap]    = useState({});
  const [logLoading, setLogLoading] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const [me, challenges] = await Promise.all([getMe(), getMyChallenges()]);
        if (cancelled) return;

        setUser(me);
        const activeChallenges = (challenges || []).filter(c => c.status === 'active');
        setActive(activeChallenges);

        const entries = await Promise.all(
          activeChallenges.map(async c => {
            const logs = await getMyLogs(c._id).catch(() => []);
            return [c._id, logs];
          })
        );
        if (!cancelled) setLogsMap(Object.fromEntries(entries));
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [refreshKey]);

  // Compute stats directly from logsMap during render — no setState needed
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let bestStreak    = 0;
  let daysCompleted = 0;

  Object.values(logsMap).forEach((logs) => {
    if (!logs?.length) return;
    const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    for (let i = 0; i < sorted.length; i++) {
      const d = new Date(sorted[i].date);
      d.setUTCHours(0, 0, 0, 0);
      const expected = new Date(today);
      expected.setDate(today.getDate() - i);
      expected.setUTCHours(0, 0, 0, 0);
      if (d.getTime() === expected.getTime() && sorted[i].goalMet) {
        streak++;
      } else {
        break;
      }
    }
    bestStreak     = Math.max(bestStreak, streak);
    daysCompleted += logs.filter(l => l.goalMet).length;
  });

  const getProgress = (c) => {
    const logs = logsMap[c._id] || [];
    const todayLog = logs.find(l => {
      const ld = new Date(l.date);
      ld.setUTCHours(0, 0, 0, 0);
      return ld.getTime() === today.getTime();
    });
    return todayLog?.amount || 0;
  };

  const getGoal     = (c) => c.goal || 1;
  const getDaysLeft = (c) => Math.max(0, Math.ceil((new Date(c.endDate) - new Date()) / (1000 * 60 * 60 * 24)));

  const handleQuickLog = async (e, challengeId) => {
    e.stopPropagation();
    const value = prompt('Log value for today:');
    if (!value || isNaN(Number(value))) return;
    setLogLoading(challengeId);
    try {
      await submitLog(challengeId, Number(value));
      setRefreshKey(k => k + 1); // triggers useEffect to re-fetch cleanly
    } catch (err) {
      alert(err.response?.data?.message || 'Log failed');
    } finally {
      setLogLoading(null);
    }
  };

  const displayName = user?.displayName || user?.username || 'Athlete';

  return (
    <div className='page fade-in'>
      <div className='flex items-center justify-between mb-20'>
        <div>
          <div className='label mb-4'>Good morning</div>
          <div className='title-xl'>{displayName} 👋</div>
        </div>
      </div>

      <div className='card card-glow mb-16'
        style={{background:'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(234,88,12,0.06))'}}>
        <div className='accent-bar' />
        <div className='label mb-16'>This Week</div>
        <div className='grid-3'>
          {[
            { l: 'Days Completed',    v: daysCompleted },
            { l: 'Active Challenges', v: active.length },
            { l: 'Best Streak',       v: `${bestStreak} 🔥` },
          ].map(({ l, v }) => (
            <div key={l} className='stat-bubble'>
              <div className='stat-value'>{v}</div>
              <div className='label'>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className='label mb-12'>Active Challenges</div>
      <div className='flex-col gap-12'>
        {active.length === 0 && (
          <div className='empty-state'>
            <div className='empty-icon'>🏁</div>
            <div className='text-dim'>No active challenges — join one!</div>
          </div>
        )}
        {active.map(c => {
          const progress = getProgress(c);
          const goal     = getGoal(c);
          const pct      = (progress / goal) * 100;
          const daysLeft = getDaysLeft(c);
          return (
            <div key={c._id} className='challenge-card'
              onClick={() => { setDetailChallenge(c); onNav('detail'); }}>
              <div className='accent-bar' />
              <div className='flex items-center justify-between mb-12'>
                <div>
                  <div className='title-sm mb-4'>{c.name}</div>
                  <div className='flex gap-8 items-center'>
                    <span className='badge badge-active'><TypeIcon type={c.type} /> {c.type}</span>
                    <span className='text-xs text-muted'>
                      {daysLeft === 0 ? '🔥 Last day!' : `${daysLeft}d left`}
                    </span>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='mono text-amber' style={{fontSize:15}}>
                    {c.participants?.length || 0} <span className='text-xs text-muted'>joined</span>
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-between mb-8'>
                <div className='text-xs text-dim'>
                  <span className='mono'>{progress.toLocaleString()}</span>
                  <span className='text-muted'> / {goal.toLocaleString()} {c.unit}</span>
                </div>
                <div className='text-xs text-dim'>{Math.round(pct)}%</div>
              </div>
              <Progress pct={pct} />
              <div className='flex items-center justify-between mt-12'>
                <div className='text-xs text-muted'>
                  {new Date(c.startDate).toLocaleDateString()} – {new Date(c.endDate).toLocaleDateString()}
                </div>
                <button className='btn btn-sm btn-primary'
                  disabled={logLoading === c._id}
                  onClick={(e) => handleQuickLog(e, c._id)}>
                  {logLoading === c._id ? '...' : '+ Quick Log'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
