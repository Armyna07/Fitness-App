const Progress  = require('../models/Progress');
const Challenge = require('../models/Challenge');
const { getIO } = require('../socket');
const lbService = require('./leaderboard.service');

const VALUE_CAPS = { steps: 100000, workout: 1440, custom: 999999, distance: 1000 };

const submit = async (challengeId, userId, value) => {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) { const e = new Error('Challenge not found'); e.statusCode = 404; throw e; }
  if (challenge.status !== 'active') {
    const e = new Error('Challenge is not active'); e.statusCode = 400; throw e;
  }
  const cap = VALUE_CAPS[challenge.type] || 999999;
  if (value > cap) {
    const e = new Error(`Value exceeds max of ${cap}`); e.statusCode = 400; throw e;
  }
  let progress = await Progress.findOne({ user: userId, challenge: challengeId });
  if (!progress) { const e = new Error('Not a participant'); e.statusCode = 403; throw e; }
  if (progress.hasLoggedToday()) {
    const e = new Error('Already logged today'); e.statusCode = 409; throw e;
  }

  const goalMet  = value >= (challenge.goal || challenge.goalValue || 0);
  const logEntry = { date: new Date(), amount: value, goalMet, submittedAt: new Date() };
  progress.logs.push(logEntry);
  progress.totalAmount += value;
  progress.updateStreak(goalMet);
  await progress.save();

  // Auto-complete: if challenge end date has passed and every participant met total goal
  const now = new Date();
  if (new Date(challenge.endDate) <= now) {
    const allProgress = await Progress.find({ challenge: challengeId });
    const goalTarget  = challenge.goal || challenge.goalValue || 0;
    const allMet      = allProgress.every(p => p.totalAmount >= goalTarget);
    if (allMet) {
      await Challenge.findByIdAndUpdate(challengeId, { status: 'completed' });
    }
  }

  // Rerank BEFORE building rankings for the socket broadcast
  await _rerank(challengeId);
  const rankings = await lbService.buildRankings(challengeId);
  try {
    getIO().to(String(challengeId)).emit('leaderboard:update', rankings);
  } catch { /* socket not initialised in test env */ }

  return { log: logEntry, goalMet, totalAmount: progress.totalAmount };
};

const _rerank = async (challengeId) => {
  const records = await Progress
    .find({ challenge: challengeId })
    .sort({ totalAmount: -1, lastLogDate: 1 });

  const updates = records.map((p, i) =>
    Progress.findByIdAndUpdate(p._id, { rankSnapshot: i + 1 })
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
  return records.flatMap(r =>
    r.logs.map(log => ({ ...log.toObject(), user: r.user }))
  ).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 50);
};

module.exports = { submit, getMyLogs, getAllLogs };
