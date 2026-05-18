const FriendChallenge = require('../models/FriendChallenge');
const Challenge       = require('../models/Challenge');
const Progress        = require('../models/Progress');
 
// Send a friend challenge — initiator picks an existing challenge and invites opponents
const send = async (challengeId, initiatorId, opponentIds) => {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    const e = new Error('Challenge not found'); e.statusCode = 404; throw e;
  }
 
  // Build responses array — one entry per opponent, all start as pending
  const responses = opponentIds.map(uid => ({ user: uid, status: 'pending' }));
 
  const fc = await FriendChallenge.create({
    challenge: challengeId,
    initiator: initiatorId,
    opponents: opponentIds,
    responses,
    status: 'pending',
  });
 
  return fc;
};
 
// An opponent responds to a friend challenge invitation
const respond = async (friendChallengeId, userId, status) => {
  const fc = await FriendChallenge.findById(friendChallengeId);
  if (!fc) {
    const e = new Error('Friend challenge not found'); e.statusCode = 404; throw e;
  }
 
  // Find this user's response entry
  const response = fc.responses.find(r => String(r.user) === String(userId));
  if (!response) {
    const e = new Error('You are not an opponent in this challenge');
    e.statusCode = 403; throw e;
  }
  if (response.status !== 'pending') {
    const e = new Error('Already responded'); e.statusCode = 409; throw e;
  }
 
  response.status = status;
  response.respondedAt = new Date();
 
  // If accepted, create a Progress record so they appear on the leaderboard
  if (status === 'accepted') {
    await Progress.findOneAndUpdate(
      { user: userId, challenge: fc.challenge },
      { $setOnInsert: { user: userId, challenge: fc.challenge } },
      { upsert: true, new: true }
    );
  }

  // if declined remove them from opponents
 
  // Use model method to check if all responded, then activate if any accepted
  if (fc.allResponded() && fc.anyAccepted()) {
    fc.status = 'active';
  }
 
  await fc.save();
  return fc;
};
 
// Get all friend challenges for a user (sent or received)
const getMine = async (userId) => {
  return FriendChallenge.find({
    $or: [{ initiator: userId }, { opponents: userId }]
  })
  .populate('challenge', 'name type goalValue status startDate endDate')
  .populate('initiator', 'displayName username avatar')
  .populate('opponents', 'displayName username avatar')
  .sort({ createdAt: -1 });
};
 
// Get one friend challenge
const getOne = async (id) => {
  const fc = await FriendChallenge.findById(id)
    .populate('challenge')
    .populate('initiator', 'displayName username avatar')
    .populate('opponents', 'displayName username avatar')
    .populate('responses.user', 'displayName username avatar')
    .populate('winner', 'displayName username avatar');
  if (!fc) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
  return fc;
};
 
module.exports = { send, respond, getMine, getOne };
