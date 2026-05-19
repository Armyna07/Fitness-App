import { useState } from 'react';
import { Avatar } from '../components/UI';
import { mockChallenges } from '../data/mockData';

// Mock friends data — replace with API call when backend is ready
const mockFriends = [
  { id: 1, name: 'Alex K.',   initials: 'AK', streak: 14, rank: 1, totalSteps: 145200, challengesWon: 8 },
  { id: 2, name: 'Jordan L.', initials: 'JL', streak: 9,  rank: 3, totalSteps: 128400, challengesWon: 5 },
  { id: 3, name: 'Sam T.',    initials: 'ST', streak: 5,  rank: 4, totalSteps: 119000, challengesWon: 3 },
  { id: 4, name: 'Chris P.',  initials: 'CP', streak: 3,  rank: 5, totalSteps: 107300, challengesWon: 2 },
  { id: 5, name: 'Rina V.',   initials: 'RV', streak: 6,  rank: 6, totalSteps: 98500,  challengesWon: 4 },
];

const mockIncoming = [
  { id: 1, from: 'Alex K.', challenge: '10K Steps Daily', sent: '2h ago' },
];

export default function FriendsPage() {
  const [tab, setTab]                       = useState('friends');
  const [search, setSearch]                 = useState('');
  const [showChallenge, setShowChallenge]   = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(mockChallenges[0].name);
  const [sentChallenges, setSentChallenges] = useState([]);

  const filtered = mockFriends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const sendChallenge = (friendId) => {
    setSentChallenges(prev => [...prev, friendId]);
    setShowChallenge(null);
  };

  const respondToChallenge = async (id, status) => {
    await fetch(`http://localhost:5000/api/friend-challenges/respond/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status }),
    });
  };

  return (
    <div className='page fade-in'>

      {/* Header */}
      <div className='flex items-center justify-between mb-20'>
        <div>
          <div className='label mb-4'>Social</div>
          <div className='title-xl'>Friends 👥</div>
        </div>
      </div>

      {/* Incoming challenges banner */}
      {mockIncoming.length > 0 && (
        <div
          className='card card-glow mb-16'
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(234,88,12,0.06))' }}
        >
          <div className='accent-bar' />
          <div className='label mb-12'>Incoming Challenges 🔔</div>
          {mockIncoming.map(inc => (
            <div key={inc.id} className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-600'>{inc.from} challenged you</div>
                <div className='text-xs text-muted'>{inc.challenge} · {inc.sent}</div>
              </div>
              <div className='flex gap-8'>
                <button
                  className='btn btn-sm btn-primary'
                  onClick={() => respondToChallenge(inc.id, 'accepted')}
                >
                  Accept
                </button>
                <button
                  className='btn btn-sm btn-ghost'
                  onClick={() => respondToChallenge(inc.id, 'declined')}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className='tab-row'>
        {['friends', 'search'].map(t => (
          <button
            key={t}
            className={`tab-pill ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── FRIENDS TAB ── */}
      {tab === 'friends' && (
        <div>
          {/* Search bar */}
          <div className='form-group mb-16'>
            <input
              className='form-input'
              placeholder='Search friends...'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Friends list */}
          <div className='flex-col gap-12'>
            {filtered.length === 0 ? (
              <div className='empty-state'>
                <div className='empty-icon'>👥</div>
                <div className='text-dim'>No friends found</div>
              </div>
            ) : filtered.map((f, i) => (
              <div key={f.id} className='card'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-12'>
                    <Avatar name={f.name} size={42} idx={i} />
                    <div>
                      <div className='title-sm mb-4'>{f.name}</div>
                      <div className='flex gap-8'>
                        <span className='text-xs text-muted'>Rank #{f.rank}</span>
                        <span className='text-xs text-muted'>·</span>
                        <span className='text-xs text-amber'>{f.streak} 🔥 streak</span>
                        <span className='text-xs text-muted'>·</span>
                        <span className='text-xs text-muted'>{f.challengesWon} wins 🏆</span>
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-8'>
                    {sentChallenges.includes(f.id) ? (
                      <span className='badge badge-active'>Sent ✓</span>
                    ) : showChallenge === f.id ? (
                      <div className='flex gap-8 items-center'>
                        <select
                          className='form-input'
                          style={{ padding: '6px 10px', fontSize: 12, width: 160 }}
                          value={selectedChallenge}
                          onChange={e => setSelectedChallenge(e.target.value)}
                        >
                          {mockChallenges
                            .filter(c => c.status === 'active')
                            .map(c => <option key={c.id}>{c.name}</option>)
                          }
                        </select>
                        <button className='btn btn-sm btn-amber' onClick={() => sendChallenge(f.id)}>Send</button>
                        <button className='btn btn-sm btn-ghost' onClick={() => setShowChallenge(null)}>✕</button>
                      </div>
                    ) : (
                      <button
                        className='btn btn-sm btn-primary'
                        onClick={() => setShowChallenge(f.id)}
                      >
                        ⚔️ Challenge
                      </button>
                    )}
                  </div>
                </div>

                {/* Mini progress bar showing total steps */}
                <div style={{ marginTop: 12 }}>
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-xs text-muted'>Total logged</span>
                    <span className='text-xs mono text-amber'>{f.totalSteps.toLocaleString()} steps</span>
                  </div>
                  <div className='progress-track'>
                    <div
                      className='progress-fill'
                      style={{ width: `${Math.min((f.totalSteps / 150000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SEARCH TAB ── */}
      {tab === 'search' && (
        <div>
          <div className='form-group mb-20'>
            <label className='form-label'>Search by username or display name</label>
            <input
              className='form-input'
              placeholder='e.g. alex_k or Alex K.'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {search.length > 0 ? (
            <div className='flex-col gap-12'>
              {mockFriends
                .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
                .map((f, i) => (
                  <div key={f.id} className='card'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-12'>
                        <Avatar name={f.name} size={38} idx={i} />
                        <div>
                          <div className='title-sm mb-4'>{f.name}</div>
                          <div className='text-xs text-muted'>{f.challengesWon} challenges won</div>
                        </div>
                      </div>
                      <span className='badge badge-active'>Already friends</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className='empty-state'>
              <div className='empty-icon'>🔍</div>
              <div className='text-dim'>Type a name to search</div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
