import { useState, useEffect } from 'react';
import { Avatar, Progress, Badge, TypeIcon } from '../components/UI';
import { COLORS } from '../constants/theme';
import { getLeaderboard, getMyLogs, leaveChallenge, submitLog, joinChallenge, deleteChallenge } from '../api/challengeApi';
import { getMe } from '../api/userApi';

export default function ChallengeDetail({ challenge, onBack }) {
  const [copied,      setCopied]      = useState(false);
  const [top3,        setTop3]        = useState([]);
  const [myLogs,      setMyLogs]      = useState([]);
  const [leaving,     setLeaving]     = useState(false);
  const [joining,     setJoining]     = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [logLoading,  setLogLoading]  = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!challenge?._id) return;
    const load = async () => {
      try {
        const [lb, logs, me] = await Promise.all([
          getLeaderboard(challenge._id),
          getMyLogs(challenge._id),
          getMe(),
        ]);
        const rankings = lb.rankings || lb;
        setTop3(rankings.slice(0, 3));
        setMyLogs(logs);
        setCurrentUser(me);
      } catch (err) {
        console.error('ChallengeDetail load error:', err);
      }
    };
    load();
  }, [challenge]);

  const buildHeatmap = () => {
    if (!challenge?.startDate) return [];
    const start = new Date(challenge.startDate);
    const end   = challenge.endDate ? new Date(challenge.endDate) : new Date();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const ds = new Date(d);
      ds.setUTCHours(0, 0, 0, 0);
      const log = myLogs.find(l => {
        const ld = new Date(l.date);
        ld.setUTCHours(0, 0, 0, 0);
        return ld.getTime() === ds.getTime();
      });
      days.push({
        day:    ds.getDate(),
        hit:    log?.goalMet ? 1 : (log ? 0.5 : 0),
        today:  ds.getTime() === today.getTime(),
        future: ds.getTime() > today.getTime(),
      });
    }
    return days.slice(0, 31);
  };

  const heatmapData = buildHeatmap();

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayLog = myLogs.find(l => {
    const ld = new Date(l.date);
    ld.setUTCHours(0, 0, 0, 0);
    return ld.getTime() === today.getTime();
  });
  const progress = todayLog?.amount || 0;
  const goal     = challenge?.goal || 1;
  const pct      = Math.min((progress / goal) * 100, 100);
  const goalMet  = progress >= goal;

  // ── Countdown ──────────────────────────────────────────────
  const nowTime    = new Date();
  const endDate    = challenge?.endDate  ? new Date(challenge.endDate)  : null;
  const startDate  = challenge?.startDate ? new Date(challenge.startDate) : null;
  const hasStarted = startDate && nowTime >= startDate;
  const hasEnded   = endDate   && nowTime >  endDate;
  const daysRemaining  = endDate   ? Math.max(0, Math.ceil((endDate  - nowTime) / (1000 * 60 * 60 * 24))) : null;
  const daysUntilStart = !hasStarted && startDate ? Math.ceil((startDate - nowTime) / (1000 * 60 * 60 * 24)) : null;
  // ───────────────────────────────────────────────────────────

  const isParticipant = challenge?.participants?.some(
    p => String(p._id || p) === String(currentUser?._id)
  );
  const isCreator = String(challenge?.createdBy?._id || challenge?.createdBy) === String(currentUser?._id);

  const handleLeave = async () => {
    if (!window.confirm('Leave this challenge?')) return;
    setLeaving(true);
    try {
      await leaveChallenge(challenge._id);
      onBack();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not leave challenge');
      setLeaving(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      await joinChallenge(challenge._id);
      const me = await getMe();
      setCurrentUser(me);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not join challenge');
    } finally {
      setJoining(false);
    }
  };

  const handleLog = async () => {
    const value = prompt(`Log today's ${challenge?.unit || 'value'}:`);
    if (!value || isNaN(Number(value))) return;
    setLogLoading(true);
    try {
      await submitLog(challenge._id, Number(value));
      const logs = await getMyLogs(challenge._id);
      setMyLogs(logs);
    } catch (err) {
      alert(err.response?.data?.message || 'Log failed');
    } finally {
      setLogLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this challenge? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteChallenge(challenge._id);
      onBack();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete challenge');
      setDeleting(false);
    }
  };

  const inviteCode = challenge?.inviteCode || `FIT-${challenge?._id?.slice(-5)}`;
  const inviteLink = challenge?.inviteLink || `fitpulse.app/join/${inviteCode}`;

  return (
    <div className='page fade-in'>
      <div className='page-back' onClick={onBack}>← Back to Challenges</div>

      {/* Countdown banners */}
      {!hasStarted && daysUntilStart !== null && (
        <div className='card mb-16' style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <div className='accent-bar' />
          <div className='text-center' style={{ padding: '8px 0' }}>
            <div className='stat-value' style={{ fontSize: 36 }}>{daysUntilStart}</div>
            <div className='label mt-4'>days until challenge starts</div>
            <div className='text-xs text-muted mt-8'>
              Starts {startDate?.toLocaleDateString()} · Ends {endDate?.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {hasStarted && !hasEnded && daysRemaining !== null && (
        <div className='card mb-16' style={{ background: 'rgba(234,88,12,0.06)', border: '1px solid rgba(234,88,12,0.15)' }}>
          <div className='flex items-center justify-between' style={{ padding: '4px 0' }}>
            <div className='label'>Time Remaining</div>
            <div className='mono text-amber' style={{ fontSize: 18, fontWeight: 700 }}>
              {daysRemaining === 0 ? '🔥 Last day!' : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`}
            </div>
          </div>
        </div>
      )}

      {/* Main card */}
      <div className='card card-glow mb-16'>
        <div className='accent-bar' />
        <div className='flex items-center justify-between mb-12'>
          <div>
            <div className='label mb-4'>Challenge</div>
            <div className='title-xl'>{challenge?.name}</div>
          </div>
          <Badge status={challenge?.status} />
        </div>
        <div className='flex gap-8 mb-16'>
          <span className='badge badge-amber'><TypeIcon type={challenge?.type} /> {challenge?.type}</span>
          {!hasStarted && daysUntilStart !== null && (
            <span className='badge badge-upcoming'>⏳ Starts in {daysUntilStart}d</span>
          )}
          {hasStarted && !hasEnded && daysRemaining !== null && (
            <span className='badge badge-upcoming'>
              🏁 {daysRemaining === 0 ? 'Last day! 🔥' : `${daysRemaining}d left`}
            </span>
          )}
          {hasEnded && (
            <span className='badge' style={{ background: 'rgba(100,116,139,0.12)', color: '#94a3b8' }}>Ended</span>
          )}
        </div>

        <div className='label mb-8'>Today's Progress</div>
        <div className='flex items-center justify-between mb-6'>
          <span className='mono text-amber'>
            {progress.toLocaleString()} <span className='text-muted text-sm'>/ {goal.toLocaleString()} {challenge?.unit}</span>
          </span>
          {goalMet && <span className='badge badge-active'>✓ Goal Met!</span>}
        </div>
        <Progress pct={pct} h={8} />

        {isParticipant && challenge?.status === 'active' && (
          <button
            className='btn btn-primary btn-sm mt-12'
            disabled={logLoading || !!todayLog}
            onClick={handleLog}
          >
            {logLoading ? '...' : todayLog ? '✓ Logged Today' : '+ Log Today'}
          </button>
        )}
      </div>

      {/* Leaderboard */}
      <div className='card mb-16'>
        <div className='flex items-center justify-between mb-16'>
          <div className='label'>Leaderboard</div>
        </div>
        {top3.length >= 3 ? (
          <div className='podium'>
            {[{slot:2,entry:top3[1],idx:1},{slot:1,entry:top3[0],idx:0},{slot:3,entry:top3[2],idx:2}].map(p => (
              <div key={p.slot} className='podium-slot'>
                <Avatar name={p.entry?.displayName || '?'} size={34} idx={p.idx} />
                <div className={`podium-block podium-${p.slot}`}>{p.slot}</div>
                <div className='podium-name'>{(p.entry?.displayName || '').split(' ')[0]}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className='empty-state'>
            <div className='empty-icon'>🏆</div>
            <div className='text-dim'>No rankings yet — be the first to log!</div>
          </div>
        )}
      </div>

      {/* Heatmap */}
      <div className='card mb-16'>
        <div className='label mb-12'>Activity Calendar</div>
        <div className='heatmap-grid'>
          {heatmapData.map((d, idx) => (
            <div key={idx}
              className={`heatmap-cell ${d.future ? 'future' : d.hit === 1 ? 'hit' : d.hit === 0.5 ? 'partial' : 'miss'} ${d.today ? 'today' : ''}`}
              title={`Day ${d.day}`} />
          ))}
        </div>
        <div className='flex gap-12 mt-12' style={{fontSize:11, color:COLORS.textMuted}}>
          <span>■ <span style={{color:COLORS.purpleLight}}>Goal Met</span></span>
          <span>■ <span style={{color:COLORS.amber}}>Logged</span></span>
          <span>■ <span style={{color:'#ef4444'}}>Missed</span></span>
          <span>□ Future</span>
        </div>
      </div>

      {/* Invite */}
      <div className='card mb-16'>
        <div className='label mb-12'>Invite Friends</div>
        <div className='share-box mb-10'>
          <span className='share-code'>{inviteCode}</span>
          <button className='btn btn-sm btn-ghost' onClick={() => {
            navigator.clipboard.writeText(inviteCode);
            setCopied(true); setTimeout(() => setCopied(false), 2000);
          }}>{copied ? '✓ Copied' : 'Copy Code'}</button>
        </div>
        <div className='share-box'>
          <span className='text-xs text-muted mono' style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
            {inviteLink}
          </span>
          <button className='btn btn-sm btn-ghost'
            onClick={() => navigator.clipboard.writeText(inviteLink)}>Copy Link</button>
        </div>
      </div>

      {/* Actions */}
      <div className='flex gap-12'>
        {isParticipant && (
          <button className='btn btn-ghost btn-sm flex-1' style={{ justifyContent: 'center' }}
            onClick={handleLeave} disabled={leaving}>
            {leaving ? 'Leaving...' : 'Leave Challenge'}
          </button>
        )}
        {!isParticipant && (
          <button className='btn btn-primary btn-sm flex-1' style={{ justifyContent: 'center' }}
            onClick={handleJoin} disabled={joining}>
            {joining ? 'Joining...' : 'Join Challenge'}
          </button>
        )}
        {isCreator && challenge?.status !== 'completed' && (
          <button className='btn btn-danger btn-sm flex-1' style={{ justifyContent: 'center' }}
            onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : '🗑 Delete Challenge'}
          </button>
        )}
      </div>

    </div>
  );
}
