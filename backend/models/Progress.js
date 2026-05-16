const mongoose = require('mongoose');

// Schema for each daily log entry
const DailyLogSchema = new mongoose.Schema({

  // Which UTC day this log is for
  date: {
    type: Date,
    required: true
  },

  // How much they logged e.g. 18500 steps
  amount: {
    type: Number,
    required: true,
    min: 0
  },

  // Did they hit the challenge goal for this day?
  goalMet: {
    type: Boolean,
    default: false
  },

  // Exact time submitted — used for tie-breaking on leaderboard
  submittedAt: {
    type: Date,
    default: Date.now
  }

}, { _id: false });

const ProgressSchema = new mongoose.Schema({

  // ── LINKS ────────────────────────────────────────
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },

  // ── DAILY LOGS (MVP PT-01) ────────────────────────
  // One entry per day per challenge
  logs: [DailyLogSchema],

  // ── LEADERBOARD RANKING (MVP LB-05) ──────────────
  // Total cumulative amount — what the leaderboard ranks by
  totalAmount: {
    type: Number,
    default: 0
  },

  // Points earned — kept for backwards compatibility
  pointsEarned: {
    type: Number,
    default: 0
  },

  // ── STREAK TRACKING (MVP PT-05 & LB-06) ──────────
  currentStreak: {
    type: Number,
    default: 0
  },

  bestStreak: {
    type: Number,
    default: 0
  },

  // Last day they submitted a log — used to detect broken streaks
  lastLogDate: {
    type: Date,
    default: null
  },

  // ── RANK TRACKING (MVP LB-04) ─────────────────────
  // Previous day rank — used to show up/down arrows
  rankSnapshot: {
    type: Number,
    default: null
  },

  // ── STATUS ───────────────────────────────────────
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  }

}, { timestamps: true });

// Compound index — one progress record per user per challenge
ProgressSchema.index({ user: 1, challenge: 1 }, { unique: true });

// Helper method — check if user already logged today
ProgressSchema.methods.hasLoggedToday = function() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return this.logs.some(log => {
    const logDate = new Date(log.date);
    logDate.setUTCHours(0, 0, 0, 0);
    return logDate.getTime() === today.getTime();
  });
};

// Helper method — update streak after a new log
ProgressSchema.methods.updateStreak = function(goalMet) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (!goalMet) {
    // Goal not met — streak stays but doesn't grow
    return;
  }

  if (!this.lastLogDate) {
    // First ever log
    this.currentStreak = 1;
  } else {
    const lastLog = new Date(this.lastLogDate);
    lastLog.setUTCHours(0, 0, 0, 0);
    const diffDays = (today - lastLog) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      // Logged yesterday — streak continues
      this.currentStreak += 1;
    } else {
      // Missed a day — streak resets
      this.currentStreak = 1;
    }
  }

  // Update best streak if current is higher
  if (this.currentStreak > this.bestStreak) {
    this.bestStreak = this.currentStreak;
  }

  this.lastLogDate = today;
};

module.exports = mongoose.model('Progress', ProgressSchema);
