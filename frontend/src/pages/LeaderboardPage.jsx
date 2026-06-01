import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Avatar, Toggle } from '../components/UI';
import { getChallenges, getFriendChallenges } from '../api/challengeApi';
import { getLeaderboard, getLeaderboardToday, getLeaderboardArchive, getGlobalLeaderboard } from '../api/leaderboardApi';
import { getMe, getFriends } from '../api/userApi';

let socket;
try { socket = io('http://localhost:5000', { timeout: 3000 }); }
catch { socket = null; }

const mapBackendRows = (data, view, myId, friendIds = []) =>
  data.map((item, i) => ({
    rank:     i + 1,
    name:     item.displayName || item.user?.displayName || item.user?.username || 'Unknown',
    total:    view === 'today' ? (item.todayAmount ?? 0) : (item.totalAmount ?? 0),
    streak:   item.currentStreak ?? 0,
    today:    (item.todayAmount ?? 0) > 0,
    me:       myId && String(item.userId) === String(myId),
    isFriend: friendIds.includes(String(item.userId)),
  }));

export default function LeaderboardPage({ archived = false }) {
  const [tab,                 setTab]               = useState('challenge');
  const [view,                setView]              = useState('cumulative');
  const [friendsOnly,         setFriendsOnly]       = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState([]);
  const [challenge,           setChallenge]         = useState(null);
  const [friendChallenges,    setFriendChallenges]  = useState([]);
  const [friendFC,            setFriendFC]          = useState(null);
  const [rows,                setRows]              = useState([]);
  const [globalRows,          setGlobalRows]        = useState([]);
  const [friendIds,           setFriendIds]         = useState([]);
  const [isLive,              setIsLive]            = useState(false);
  const [lastUpdate,          setLastUpdate]        = useState(null);
  const [myId,                setMyId]              = useState(null);
  const [loading,             setLoading]           = useState(true);

  // Load current user + friends once on mount
  useEffect(() => {
    getMe().then(u => setMyId(u._id || u.id)).catch(() => {});
    getFriends().then(fs => setFriendIds(fs.map(f => String(f._id || f.id)))).catch(() => {});
  }, []);

  // Load challenges and friend challenges
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getChallenges();
        const list = data.challenges || [];
        setAvailableChallenges(list);
        if (list.length) {
          const first = list.find(c => c.status === 'active') || list[0];
          setChallenge(first);
        }
        const fcs = await getFriendChallenges();
        setFriendChallenges(fcs);
        if (fcs.length) setFriendFC(fcs[0]);
      } catch (err) {
        console.error('LeaderboardPage init error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Challenge tab leaderboard
  useEffect(() => {
    if (tab !== 'challenge' || !challenge) return;
    const load = async () => {
      try {
        const id = challenge._id || challenge.id;
        const data = archived
          ? await getLeaderboardArchive(id)
          : view === 'today'
            ? await getLeaderboardToday(id)
            : await getLeaderboard(id);
        setRows(mapBackendRows(data.rankings || data, view, myId, friendIds));
      } catch (err) { console.error(err); }
    };
    load();
  }, [archived, tab, challenge, view, myId, friendIds]);

  // Global tab leaderboard
  useEffect(() => {
    if (tab !== 'global') return;
    getGlobalLeaderboard()
      .then(data => setGlobalRows(mapBackendRows(data.rankings || [], 'cumulative', myId, friendIds)))
      .catch(console.error);
  }, [tab, myId, friendIds]);

  // Friend battle tab leaderboard
  useEffect(() => {
    if (tab !== 'friend' || !friendFC) return;
    const load = async () => {
      try {
        const id = friendFC.challenge?._id || friendFC.challenge;
        const data = await getLeaderboard(id);
        const participantIds = [
          friendFC.initiator?._id,
          ...(friendFC.opponents || []).map(o => o._id || o),
        ].filter(Boolean).map(String);
        const filtered = (data.rankings || []).filter(r =>
          participantIds.includes(String(r.userId))
        );
        setRows(mapBackendRows(filtered, 'cumulative', myId, friendIds));
      } catch (err) { console.error(err); }
    };
    load();
  }, [tab, friendFC, myId, friendIds]);

  // Socket live indicator
  useEffect(() => {
    if (!socket) return;
    socket.on('connect', () => setIsLive(true));
    socket.on('disconnect', () => setIsLive(false));
    return () => { socket.off('connect'); socket.off('disconnect'); };
  }, []);

  // Socket leaderboard updates for challenge tab
  useEffect(() => {
    if (!socket || tab !== 'challenge' || !challenge) return;
    const challengeId = String(challenge._id || challenge.id);
    const joinRoom = () => socket.emit('join-challenge', challengeId);
    if (socket.connected) joinRoom();
    socket.on('connect', joinRoom);
    socket.on('leaderboard:update', (rankings) => {
      if (tab !== 'challenge') return;
      setRows(mapBackendRows(rankings, view, myId, friendIds));
      setLastUpdate(new Date().toLocaleTimeString());
    });
    return () => {
      socket.off('connect', joinRoom);
      socket.off('leaderboard:update');
      socket.emit('leave-challenge', challengeId);
    };
  }, [challenge, tab, view, myId, friendIds]);

  const displayRows = friendsOnly ? rows.filter(r => r.me || r.isFriend) : rows;
  const top3 = displayRows.slice(0, 3);
  const activeRows = tab === 'global' ? globalRows : displayRows;

  if (loading) return <div className='page fade-in'><div className='text-muted'>Loading...</div></div>;

  return (
    <div className='page fade-in'>

      {/* Header */}
      <div className='flex items-center justify-between mb-20'>
        <div>
          <div className='label mb-4'>Rankings</div>
          <div className='title-xl'>{archived ? 'Archived' : 'Leaderboard'} 🏆</div>
        </div>
        <div className='flex gap-8 items-center'>
          {!archived && (
            <div className='flex items-center gap-8'>
              <div style={{ width: 8, height: 8, borderRadius: '50%',
                background: isLive ? '#10b981' : '#64748b',
                boxShadow: isLive ? '0 0 6px #10b981' : 'none' }} />
              <span className='text-xs text-muted'>{isLive ? 'Live' : 'Offline'}</span>
            </div>
          )}
          {lastUpdate && <span className='text-xs text-muted'>Updated {lastUpdate}</span>}
        </div>
      </div>

      {/* Tab pills */}
      {!archived && (
        <div className='tab-row mb-16'>
          {[
            { key: 'challenge', label: '🏆 Challenge' },
            { key: 'global',    label: '🌍 Global' },
            { key: 'friend',    label: '👥 Friend Battle' },
          ].map(t => (
            <button key={t.key}
              className={`tab-pill ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Challenge selector */}
      {(tab === 'challenge' || archived) && (
        <div className='form-group mb-16'>
          <select className='form-input'
            value={challenge?._id || ''}
            onChange={e => {
              const found = availableChallenges.find(c => c._id === e.target.value);
              setChallenge(found || null);
            }}>
            {availableChallenges
              .filter(c => archived ? c.status === 'completed' : c.status === 'active')
              .map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      )}

      {/* Friend battle selector */}
      {tab === 'friend' && !archived && (
        <div className='form-group mb-16'>
          {friendChallenges.length === 0 ? (
            <div className='empty-state'>
              <div className='empty-icon'>⚔️</div>
              <div className='text-dim'>No friend challenges yet — challenge a friend from the Friends page!</div>
            </div>
          ) : (
            <select className='form-input'
              value={friendFC?._id || ''}
              onChange={e => {
                const found = friendChallenges.find(f => f._id === e.target.value);
                setFriendFC(found || null);
              }}>
              {friendChallenges.map(f => (
                <option key={f._id} value={f._id}>
                  {f.initiator?.displayName || f.initiator?.username} vs you — {f.challenge?.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* View toggle + friends filter (challenge tab only) */}
      {!archived && tab === 'challenge' && (
        <div className='flex gap-8 mb-20 flex-wrap items-center'>
          <div className='tab-row' style={{ margin: 0 }}>
            {['cumulative', 'today'].map(v => (
              <button key={v}
                className={`tab-pill ${view === v ? 'active' : ''}`}
                onClick={() => setView(v)}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <div className='toggle-row' style={{ gap: 8 }}>
            <span className='text-xs text-muted'>Friends only</span>
            <Toggle on={friendsOnly} onChange={setFriendsOnly} />
          </div>
        </div>
      )}

      {/* Podium — hidden on global tab */}
      {top3.length >= 3 && tab !== 'global' && (
        <div className='card mb-16'>
          <div className='podium'>
            {[
              { pos: 2, entry: top3[1], idx: 1 },
              { pos: 1, entry: top3[0], idx: 0 },
              { pos: 3, entry: top3[2], idx: 2 },
            ].map(p => (
              <div key={p.pos} className='podium-slot'>
                <Avatar name={p.entry?.name || '?'} size={38} idx={p.idx} />
                <div className={`podium-block podium-${p.pos}`}>{p.pos}</div>
                <div className='podium-name'>{(p.entry?.name || '').split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main table — skip if friend tab has no challenges */}
      {tab === 'friend' && friendChallenges.length === 0 ? null : (
        <div className='card'>
          <div className='label mb-12' style={{ padding: '0 14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '36px 36px 1fr 90px 70px 36px', gap: 8, alignItems: 'center' }}>
              <span>Rank</span>
              <span></span>
              <span>Name</span>
              <span style={{ textAlign: 'right' }}>{view === 'today' ? 'Today' : 'Total'}</span>
              <span style={{ textAlign: 'right' }}>Streak</span>
              <span style={{ textAlign: 'center' }}>✓</span>
            </div>
          </div>

          <div className='flex-col' style={{ gap: 2 }}>
            {activeRows.length === 0 ? (
              <div className='empty-state'>
                <div className='empty-icon'>🏆</div>
                <div className='text-dim'>No data yet — be the first to log!</div>
              </div>
            ) : activeRows.map((p, i) => (
              <div key={i} className={`lb-row ${p.me ? 'me' : ''}`}>
                <div className='lb-rank'>
                  {p.rank <= 3 ? ['🥇', '🥈', '🥉'][p.rank - 1] : p.rank}
                </div>
                <Avatar name={p.name} size={30} idx={i} />
                <div>
                  <div className='lb-name'>
                    {p.name} {p.me && <span className='text-xs text-purple'>(you)</span>}
                  </div>
                </div>
                <div className='lb-stat'>{(p.total || 0).toLocaleString()}</div>
                <div className='lb-stat'>{p.streak ?? 0} 🔥</div>
                <div className={`lb-check ${p.today ? 'done' : 'pending'}`}>
                  {p.today ? '✓' : '–'}
                </div>
              </div>
            ))}
          </div>

          {/* "You" row at the bottom if not in list (not shown on global tab) */}
          {activeRows.length > 0 && !activeRows.find(p => p.me) && tab !== 'global' && (
            <>
              <div className='divider' />
              <div className='lb-row me'>
                <div className='lb-rank'>—</div>
                <Avatar name='You' size={30} idx={1} />
                <div><div className='lb-name'>You <span className='text-xs text-purple'>(you)</span></div></div>
                <div className='lb-stat'>—</div>
                <div className='lb-stat'>— 🔥</div>
                <div className='lb-check pending'>–</div>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}