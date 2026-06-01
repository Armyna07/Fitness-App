import { useState, useEffect } from 'react';
import { Avatar } from '../components/UI';
import { getFriends, searchUsers, removeFriend } from '../api/userApi';
import { getMyChallenges, sendFriendChallenge, respondFriendChallenge, getFriendChallenges } from '../api/challengeApi';
import API from '../api/axios';

export default function FriendsPage() {
  const [tab,            setTab]            = useState('friends');
  const [search,         setSearch]         = useState('');
  const [friends,        setFriends]        = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [incoming,       setIncoming]       = useState([]);
  const [myChallenges,   setMyChallenges]   = useState([]);
  const [searchResults,  setSearchResults]  = useState([]);
  const [showChallenge,  setShowChallenge]  = useState(null);
  const [selectedChalId, setSelectedChalId] = useState('');
  const [sentChallenges, setSentChallenges] = useState([]);
  const [sentRequests,   setSentRequests]   = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [searchLoading,  setSearchLoading]  = useState(false);
  const [removing,       setRemoving]       = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey(k => k + 1);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        const [friendList, fcs, challenges, reqRes] = await Promise.all([
          getFriends(),
          getFriendChallenges(),
          getMyChallenges(),
          API.get('/users/me/friend-requests').then(r => r.data.requests).catch(() => []),
        ]);
        if (cancelled) return;
        setFriends(friendList);
        setPendingRequests(reqRes);
        setIncoming(fcs.filter(fc => fc.responses?.some(r => r.status === 'pending')));
        const active = challenges.filter(c => c.status === 'active');
        setMyChallenges(active);
        setSelectedChalId(active[0]?._id ?? '');
      } catch (err) {
        console.error('FriendsPage load error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => { cancelled = true; };
  }, [refreshKey]);

  useEffect(() => {
    if (tab !== 'search' || search.length < 2) return;
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await searchUsers(search);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [search, tab]);

  const handleTabChange = (t) => {
    setTab(t);
    if (t !== 'search') setSearchResults([]);
  };

  const handleSendRequest = async (u) => {
    try {
      await API.post(`/users/me/friend-requests/${u._id}`);
      setSentRequests(prev => [...prev, String(u._id)]);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not send request');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await API.patch(`/users/me/friend-requests/${requestId}/accept`);
      setPendingRequests(prev => prev.filter(r => r._id !== requestId));
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not accept request');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await API.patch(`/users/me/friend-requests/${requestId}/decline`);
      setPendingRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not decline request');
    }
  };

  const sendChallenge = async (friendId) => {
    if (!selectedChalId) return;
    try {
      await sendFriendChallenge(selectedChalId, [friendId]);
      setSentChallenges(prev => [...prev, friendId]);
      setShowChallenge(null);
    } catch (err) {
      console.error('Send challenge error:', err);
    }
  };

  const respondToChallenge = async (id, status) => {
    try {
      await respondFriendChallenge(id, status);
      setIncoming(prev => prev.filter(fc => fc._id !== id));
    } catch (err) {
      console.error('Respond error:', err);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm('Remove this friend?')) return;
    setRemoving(friendId);
    try {
      await removeFriend(friendId);
      setFriends(prev => prev.filter(f => String(f._id) !== String(friendId)));
    } catch (err) {
      console.error('Remove friend error:', err);
    } finally {
      setRemoving(null);
    }
  };

  const filteredFriends = friends.filter(f =>
    (f.displayName || f.username || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className='page fade-in'><div className='text-muted'>Loading...</div></div>;

  return (
    <div className='page fade-in'>

      {/* Header */}
      <div className='flex items-center justify-between mb-20'>
        <div>
          <div className='label mb-4'>Social</div>
          <div className='title-xl'>Friends 👥</div>
        </div>
      </div>

      {/* Pending friend requests */}
      {pendingRequests.length > 0 && (
        <div className='card card-glow mb-16'
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(234,88,12,0.06))' }}>
          <div className='accent-bar' />
          <div className='label mb-12'>Friend Requests 🔔 ({pendingRequests.length})</div>
          <div className='flex-col gap-12'>
            {pendingRequests.map((req, i) => (
              <div key={req._id} className='flex items-center justify-between'>
                <div className='flex items-center gap-12'>
                  <Avatar name={req.from?.displayName || req.from?.username || '?'} size={38} idx={i} />
                  <div>
                    <div className='text-sm font-600'>
                      {req.from?.displayName || req.from?.username}
                    </div>
                    <div className='text-xs text-muted'>wants to be your friend</div>
                  </div>
                </div>
                <div className='flex gap-8'>
                  <button className='btn btn-sm btn-primary'
                    onClick={() => handleAcceptRequest(req._id)}>Accept</button>
                  <button className='btn btn-sm btn-ghost'
                    onClick={() => handleDeclineRequest(req._id)}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incoming challenges */}
      {incoming.length > 0 && (
        <div className='card card-glow mb-16'
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(234,88,12,0.06))' }}>
          <div className='accent-bar' />
          <div className='label mb-12'>Incoming Challenges ⚔️</div>
          {incoming.map(fc => (
            <div key={fc._id} className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-600'>
                  {fc.initiator?.displayName || fc.initiator?.username} challenged you
                </div>
                <div className='text-xs text-muted'>
                  {fc.challenge?.name} · {new Date(fc.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className='flex gap-8'>
                <button className='btn btn-sm btn-primary'
                  onClick={() => respondToChallenge(fc._id, 'accepted')}>Accept</button>
                <button className='btn btn-sm btn-ghost'
                  onClick={() => respondToChallenge(fc._id, 'declined')}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className='tab-row mb-16'>
        {['friends', 'search'].map(t => (
          <button key={t} className={`tab-pill ${tab === t ? 'active' : ''}`}
            onClick={() => handleTabChange(t)}>
            {t === 'friends' ? `Friends (${friends.length})` : 'Find People'}
          </button>
        ))}
      </div>

      {/* ── FRIENDS TAB ── */}
      {tab === 'friends' && (
        <div>
          <div className='form-group mb-16'>
            <input className='form-input' placeholder='Search friends...'
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className='flex-col gap-12'>
            {filteredFriends.length === 0 ? (
              <div className='empty-state'>
                <div className='empty-icon'>👥</div>
                <div className='text-dim'>
                  {friends.length === 0
                    ? 'No friends yet — search to add some!'
                    : 'No friends match your search'}
                </div>
              </div>
            ) : filteredFriends.map((f, i) => (
              <div key={f._id} className='card'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-12'>
                    <Avatar name={f.displayName || f.username} size={42} idx={i} />
                    <div>
                      <div className='title-sm mb-4'>{f.displayName || f.username}</div>
                      <div className='flex gap-8'>
                        <span className='text-xs text-muted'>{f.challengesWon || 0} wins 🏆</span>
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-8'>
                    {sentChallenges.includes(f._id) ? (
                      <span className='badge badge-active'>Sent ✓</span>
                    ) : showChallenge === f._id ? (
                      <div className='flex gap-8 items-center'>
                        <select className='form-input'
                          style={{ padding: '6px 10px', fontSize: 12, width: 160 }}
                          value={selectedChalId}
                          onChange={e => setSelectedChalId(e.target.value)}>
                          {myChallenges.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                        <button className='btn btn-sm btn-amber'
                          onClick={() => sendChallenge(f._id)}>Send</button>
                        <button className='btn btn-sm btn-ghost'
                          onClick={() => setShowChallenge(null)}>✕</button>
                      </div>
                    ) : (
                      <div className='flex gap-8'>
                        <button className='btn btn-sm btn-primary'
                          onClick={() => setShowChallenge(f._id)}>⚔️ Challenge</button>
                        <button className='btn btn-sm btn-ghost'
                          style={{ color: '#ef4444' }}
                          disabled={removing === f._id}
                          onClick={() => handleRemoveFriend(f._id)}>
                          {removing === f._id ? '...' : 'Remove'}
                        </button>
                      </div>
                    )}
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
            <input className='form-input' placeholder='e.g. alex_k or Alex K.'
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {searchLoading && <div className='text-muted text-sm'>Searching...</div>}

          {!searchLoading && search.length >= 2 && (
            <div className='flex-col gap-12'>
              {searchResults.length === 0 ? (
                <div className='empty-state'>
                  <div className='empty-icon'>🔍</div>
                  <div className='text-dim'>No users found</div>
                </div>
              ) : searchResults.map((u, i) => {
                const isFriend    = friends.some(f => String(f._id) === String(u._id));
                const requestSent = sentRequests.includes(String(u._id));
                const hasPending  = pendingRequests.some(r => String(r.from?._id) === String(u._id));
                return (
                  <div key={u._id} className='card'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-12'>
                        <Avatar name={u.displayName || u.username} size={38} idx={i} />
                        <div>
                          <div className='title-sm mb-4'>{u.displayName || u.username}</div>
                          <div className='text-xs text-muted'>@{u.username}</div>
                        </div>
                      </div>
                      {isFriend ? (
                        <span className='badge badge-active'>Friends ✓</span>
                      ) : hasPending ? (
                        <span className='badge badge-upcoming'>Request received</span>
                      ) : requestSent ? (
                        <span className='badge badge-upcoming'>Request sent ⏳</span>
                      ) : (
                        <button className='btn btn-sm btn-primary'
                          onClick={() => handleSendRequest(u)}>
                          + Add Friend
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {search.length < 2 && (
            <div className='empty-state'>
              <div className='empty-icon'>🔍</div>
              <div className='text-dim'>Type at least 2 characters to search</div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
