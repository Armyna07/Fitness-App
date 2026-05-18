const Progress = require("../models/Progress");
const Challenge = require("../models/Challenge");
const User = require("../models/User");

const buildRankings = async (challengeId) => {
  const records = await Progress.find({ challenge: challengeId })
    .sort({ totalAmount: -1, lastLogDate: 1 })
    .populate("user", "displayName username avatar");

  return records.map((p, i) => ({
    rank: i + 1,
    userId: p.user._id,
    displayName: p.user.displayName || p.user.username,
    avatar: p.user.avatar,
    totalAmount: p.totalAmount,
    currentStreak: p.currentStreak,
    bestStreak: p.bestStreak,
    rankSnapshot: p.rankSnapshot, // previous rank for up/down arrow
    // rankChange: positive = moved up, negative = moved down
    rankChange: p.rankSnapshot ? p.rankSnapshot - (i + 1) : 0,
  }));
};

const getTodayRankings = async (challengeId) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const records = await Progress.find({ challenge: challengeId }).populate(
    "user",
    "displayName username avatar",
  );

  // Filter to only include today's log for each user, sort by today's amount
  const todayEntries = records
    .map((p) => {
      const todayLog = p.logs.find((log) => {
        const d = new Date(log.date);
        d.setUTCHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });
      return {
        user: p.user,
        todayAmount: todayLog ? todayLog.amount : 0,
        goalMet: todayLog ? todayLog.goalMet : false,
      };
    })
    .sort((a, b) => b.todayAmount - a.todayAmount);

  return todayEntries.map((e, i) => ({ rank: i + 1, ...e }));
};

// Called by cron job when challenge transitions to 'completed'
// Writes finalLeaderboard directly onto the Challenge document
const archive = async (challengeId) => {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge || challenge.finalLeaderboard.length > 0) return; // already archived

  const rankings = await buildRankings(challengeId);

  challenge.finalLeaderboard = rankings.map((r) => ({
    user: r.userId,
    rank: r.rank,
    totalAmount: r.totalAmount,
  }));
  await challenge.save();

  // Update winner and participant stats on User
  if (rankings.length > 0) {
    await User.findByIdAndUpdate(rankings[0].userId, {
      $inc: { challengesWon: 1 },
    });
  }
  const allIds = rankings.map((r) => r.userId);
  await User.updateMany(
    { _id: { $in: allIds } },
    { $inc: { challengesParticipated: 1 } }, // your field name
  );
};

// Returns the stored final leaderboard from the Challenge document
const getArchive = async (challengeId) => {
  const challenge = await Challenge.findById(challengeId).populate(
    "finalLeaderboard.user",
    "displayName username avatar",
  );
  if (!challenge) {
    const e = new Error("Challenge not found");
    e.statusCode = 404;
    throw e;
  }
  if (!challenge.finalLeaderboard || challenge.finalLeaderboard.length === 0) {
    const e = new Error("No final leaderboard available yet");
    e.statusCode = 404;
    throw e;
  }
  return challenge.finalLeaderboard;
};

module.exports = { buildRankings, getTodayRankings, archive, getArchive };
