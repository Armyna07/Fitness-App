import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Avatar, Toggle } from '../components/UI';
import { mockChallenges, mockLeaderboard } from '../data/mockData';

// ── Socket connection ──────────────────────────────────────────────────────
let socket;
try {
  socket = io('http://localhost:5000', { timeout: 3000 });
} catch {
  socket = null;
}

// ── Mock friend challenges for the Friend Battle tab ───────────────────────
const mockFriendChallenges = [
  { id: 'fc1', label: 'Alex K. vs You — 10K Steps' },
  { id: 'fc2', label: 'Jordan L. vs Sam T. vs You — Push-Up' },
];

// ── Helper: map backend data to leaderboard row format ─────────────────────
const mapBackendRows = (data, view) =>
  data.map((item, i) => ({
    rank:   i + 1,
    name:   item.user?.username || item.username || 'Unknown',
    total:  view === 'today' ? (item.todayAmount ?? item.points ?? 0) : (item.totalAmount ?? item.points ?? 0),
    streak: item.currentStreak ?? 0,
    today:  (item.todayAmount ?? 0) > 0,
    me:     false,
  }));

export default function LeaderboardPage({ archived = false }) {
  const [tab,        setTab]        = useState('challenge');
  const [view,       setView]       = useState('cumulative');
  const [friends,    setFriends]    = useState(false);
  const [challenge,  setChallenge]  = useState(mockChallenges.filter(c => c.status === 'active')[0]);
  const [friendFC,   setFriendFC]   = useState(mockFriendChallenges[0]);
  const [rows,       setRows]       = useState(mockLeaderboard);
  const [isLive,     setIsLive]     = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const joinedRooms = useRef(new Set());

  // ── Socket.io setup ────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      setIsLive(true);
      socket.emit('join-leaderboard', 'global-leaderboard');
      joinedRooms.current.add('global-leaderboard');
    });

    socket.on('disconnect', () => setIsLive(false));

    socket.on('global-leaderboard-update', (data) => {
      if (tab === 'global') {
        setRows(mapBackendRows(data, view));
        setLastUpdate(new Date().toLocaleTimeString());
      }
    });

    socket.on('leaderboard-update', (data) => {
      if (tab === 'challenge') {
        setRows(mapBackendRows(data, view));
        setLastUpdate(new Date().toLocaleTimeString());
      }
    });

    socket.on('friend-leaderboard-update', (data) => {
      if (tab === 'friend') {
        setRows(mapBackendRows(data, view));
        setLastUpdate(new Date().toLocaleTimeString());
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('global-leaderboard-update');
      socket.off('leaderboard-update');
      socket.off('friend-leaderboard-update');
    };
  }, [tab, view]);

  // ── Join correct room + fetch initial data when tab/challenge changes ──
  useEffect(() => {
    if (!socket || !isLive) return;

    if (tab === 'global') {
      const room = 'global-leaderboard';
      if (!joinedRooms.current.has(room)) {
        socket.emit('join-leaderboard', room);
        joinedRooms.current.add(room);
      }
      fetch('http://localhost:5000/api/leaderboard/global')
        .then(r => r.json())
        .then(data => setRows(mapBackendRows(data, view)))
        .catch(() => {});
    }

    if (tab === 'challenge' && challenge?._id) {
      const room = `challenge-${challenge._id}`;
      if (!joinedRooms.current.has(room)) {
        socket.emit('join-leaderboard', room);
        joinedRooms.current.add(room);
      }
      fetch(`http://localhost:5000/api/leaderboard/challenge/${challenge._id}`)
        .then(r => r.json())
        .then(data => setRows(mapBackendRows(data, view)))
        .catch(() => {});
    }

    if (tab === 'friend' && friendFC?.id) {
      const room = `friend-challenge-${friendFC.id}`;
      if (!joinedRooms.current.has(room)) {
        socket.emit('join-leaderboard', room);
        joinedRooms.current.add(room);
      }
      fetch(`http://localhost:5000/api/leaderboard/friend-challenge/${friendFC.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(r => r.json())
        .then(data => setRows(mapBackendRows(data, view)))
        .catch(() => {});
    }
  }, [tab, challenge, friendFC, isLive, view]);

  // ── Filter rows ───────────────────────────────────────────────────────
  const displayRows = friends ? rows.filter(r => r.me || r.isFriend) : rows;
  const top3 = displayRows.slice(0, 3);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className='page fade-in'>

      {/* Header */}
      <div className='flex items-center justify-between mb-20'>
        <div>
          <div className='label mb-4'>Rankings</div>
          <div className='title-xl'>
            {archived ? 'Archived' : 'Leaderboard'} 🏆
          </div>
        </div>
        <div className='flex gap-8 items-center'>
          {archived && <span className='badge badge-completed'>Final Snapshot</span>}
          {!archived && (
            <div className='flex items-center gap-8'>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: isLive ? '#10b981' : '#64748b',
                boxShadow: isLive ? '0 0 6px #10b981' : 'none',
                animation: isLive ? 'pulse-glow 2s ease-in-out infinite' : 'none'
              }} />
              <span className='text-xs text-muted'>
                {isLive ? 'Live' : 'Offline — showing mock data'}
              </span>
            </div>
          )}
          {lastUpdate && (
            <span className='text-xs text-muted'>Updated {lastUpdate}</span>
          )}
        </div>
      </div>

      {/* Leaderboard Type Tabs */}
      {!archived && (
        <div className='tab-row mb-16'>
          {[
            { key: 'challenge', label: '🏆 Challenge' },
            { key: 'global',    label: '🌍 Global'    },
            { key: 'friend',    label: '👥 Friend Battle' },
          ].map(t => (
            <button
              key={t.key}
              className={`tab-pill ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Challenge selector */}
      {(tab === 'challenge' || archived) && (
        <div className='form-group mb-16'>
          <select
            className='form-input'
            value={challenge?.name || ''}
            onChange={e => {
              const found = mockChallenges.find(c => c.name === e.target.value);
              setChallenge(found || null);
            }}
          >
            {mockChallenges
              .filter(c => archived ? c.status === 'completed' : c.status === 'active')
              .map(c => <option key={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}

      {/* Friend Challenge selector */}
      {tab === 'friend' && !archived && (
        <div className='form-group mb-16'>
          <select
            className='form-input'
            value={friendFC?.id || ''}
            onChange={e => {
              const found = mockFriendChallenges.find(f => f.id === e.target.value);
              setFriendFC(found || null);
            }}
          >
            {mockFriendChallenges.map(f => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Cumulative / Today + Friends only toggles */}
      {!archived && tab === 'challenge' && (
        <div className='flex gap-8 mb-20 flex-wrap items-center'>
          <div className='tab-row' style={{ margin: 0 }}>
            {['cumulative', 'today'].map(v => (
              <button
                key={v}
                className={`tab-pill ${view === v ? 'active' : ''}`}
                onClick={() => setView(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <div className='toggle-row' style={{ gap: 8 }}>
            <span className='text-xs text-muted'>Friends only</span>
            <Toggle on={friends} onChange={setFriends} />
          </div>
        </div>
      )}

      {/* Podium */}
      {top3.length >= 3 && (
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

      {/* Full leaderboard table */}
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
          {displayRows.length === 0 ? (
            <div className='empty-state'>
              <div className='empty-icon'>🏆</div>
              <div className='text-dim'>No data yet — be the first to log!</div>
            </div>
          ) : displayRows.map((p, i) => (
            <div key={i} className={`lb-row ${p.me ? 'me' : ''}`}>
              <div className='lb-rank'>
                {p.rank <= 3 ? ['🥇','🥈','🥉'][p.rank - 1] : p.rank}
              </div>
              <Avatar name={p.name} size={30} idx={i} />
              <div>
                <div className='lb-name'>
                  {p.name}{' '}
                  {p.me && <span className='text-xs text-purple'>(you)</span>}
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

        {/* Sticky own rank */}
        {displayRows.length > 0 && !displayRows.find(p => p.me) && (
          <>
            <div className='divider' />
            <div className='lb-row me'>
              <div className='lb-rank'>—</div>
              <Avatar name='You' size={30} idx={1} />
              <div>
                <div className='lb-name'>
                  You <span className='text-xs text-purple'>(you)</span>
                </div>
              </div>
              <div className='lb-stat'>—</div>
              <div className='lb-stat'>— 🔥</div>
              <div className='lb-check pending'>–</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
