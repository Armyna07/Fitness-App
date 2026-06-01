const Progress = require("../models/Progress");
const User = require("../models/User");

const getGlobal = async (req, res, next) => {
  try {
    // Aggregate total across all active challenges per user, top 50
    const results = await Progress.aggregate([
      {
        $group: {
          _id: "$user",
          totalAmount: { $sum: "$totalAmount" },
          bestStreak: { $max: "$bestStreak" },
          challengeCount: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }
    ]);

    const rankings = results.map((r, i) => ({
      rank: i + 1,
      userId: r._id,
      displayName: r.user.displayName || r.user.username,
      avatar: r.user.avatar,
      totalAmount: r.totalAmount,
      bestStreak: r.bestStreak,
      challengeCount: r.challengeCount,
    }));

    res.json({ rankings });
  } catch (err) { next(err); }
};

module.exports = { getGlobal };
