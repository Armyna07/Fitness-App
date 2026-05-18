const Progress  = require('../models/Progress');
const Challenge = require('../models/Challenge');
const { getIO } = require('../socket');
const lbService = require('./leaderboard.service');
 
const VALUE_CAPS = { steps: 100000, workout: 1440, custom: 999999 };
 
const submit = async (challengeId, userId, value) => {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    const e = new Error('Challenge not found'); e.statusCode = 404; throw e;
  }
  if (challenge.status !== 'active') {
    const e = new Error('Challenge is not active'); e.statusCode = 400; throw e;
  }
 
  const cap = VALUE_CAPS[challenge.type] || 999999;
  if (value > cap) {
    const e = new Error(`Value exceeds max of ${cap} for ${challenge.type}`);
    e.statusCode = 400; throw e;
  }
 
  // Find or create the Progress record for this user+challenge
  let progress = await Progress.findOne({ user: userId, challenge: challengeId });
  if (!progress) {
    const e = new Error('Not a participant in this challenge');
    e.statusCode = 403; throw e;
  }
 
  // Use the model method to block duplicate logs
  if (progress.hasLoggedToday()) {
    const e = new Error('Already logged today for this challenge');
    e.statusCode = 409; throw e;
  }
 
  const goalMet = value >= challenge.goalValue;
 
  // Add the daily log entry to the embedded logs array
  const logEntry = {
    date:        new Date(),
    amount:      value,
    goalMet,
    submittedAt: new Date(),
  };
  progress.logs.push(logEntry);
 
  // Update cumulative total
  progress.totalAmount += value;
 
  // Use the model method to update streak
  progress.updateStreak(goalMet);
 
  await progress.save();
 
  // Re-rank all participants and push live update
  await _rerank(challengeId);
  const rankings = await lbService.buildRankings(challengeId);
  try {
    getIO().to(challengeId.toString()).emit('leaderboard:update', rankings);
  } catch { /* socket not initialised in test env */ }
 
  return { log: logEntry, goalMet, totalAmount: progress.totalAmount };
};
 
// Re-rank: sort all Progress records by totalAmount desc, submittedAt asc
// Saves previous rank as rankSnapshot (for up/down arrows)
const _rerank = async (challengeId) => {
  const records = await Progress
    .find({ challenge: challengeId })
    .sort({ totalAmount: -1, lastLogDate: 1 });
 
  const updates = records.map((p, i) =>
    Progress.findByIdAndUpdate(p._id, {
      rankSnapshot: p.rankSnapshot, // keep yesterday's snapshot
    })
  );
  await Promise.all(updates);
};
 
const getMyLogs = async (challengeId, userId) => {
  const progress = await Progress.findOne({ user: userId, challenge: challengeId });
  if (!progress) return [];
  return progress.logs.sort((a, b) => new Date(b.date) - new Date(a.date));
};
 
const getAllLogs = async (challengeId) => {
  const records = await Progress
    .find({ challenge: challengeId })
    .populate('user', 'displayName username avatar')
    .select('logs user');
  // Flatten all logs with user info
  return records.flatMap(r =>
    r.logs.map(log => ({ ...log.toObject(), user: r.user }))
  ).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 50);
};
 
module.exports = { submit, getMyLogs, getAllLogs };
