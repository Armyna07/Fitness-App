const mongoose = require('mongoose');
// const crypto = require('crypto');

const ChallengeSchema = new mongoose.Schema({

  // ── BASIC INFO ───────────────────────────────────
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  rules: {
    type: String
  },

  // ── CHALLENGE TYPE (MVP CH-02) ───────────────────
  type: {
    type: String,
    enum: ['steps', 'workout', 'custom'],
    required: true
  },

  // Only used when type is 'custom'
  customMetric: {
    type: String,
    maxlength: 30  // e.g. 'pushups'
  },

  customUnit: {
    type: String,
    maxlength: 15  // e.g. 'reps'
  },

  // ── GOAL (MVP CH-01) ─────────────────────────────
  goalValue: {
    type: Number,
    required: true  // e.g. 20000 for steps
  },

  // ── DATES ────────────────────────────────────────
  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  duration: {
    type: Number  // calculated in days
  },

  // ── STATUS LIFECYCLE (MVP CH-10) ──────────────────
  // draft → active → completed
  status: {
    type: String,
    enum: ['draft', 'active', 'completed'],
    default: 'draft'
  },

  // ── INVITE SYSTEM (MVP CH-03) ─────────────────────
  inviteCode: {
    type: String,
    unique: true,
    sparse: true  // allows multiple null values
  },

  inviteLink: {
    type: String
  },

  // ── PARTICIPANTS ──────────────────────────────────
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Max participants cap — null means unlimited (MVP CH-09)
  maxParticipants: {
    type: Number,
    default: null
  },

  // ── VISIBILITY (public/private) ───────────────────
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },

  // Who created the challenge
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Users allowed to join private challenges
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // ── LEADERBOARD SNAPSHOT (MVP LB-07) ─────────────
  // Saved when challenge completes — final rankings preserved
  finalLeaderboard: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rank: Number,
    totalAmount: Number
  }]

}, { timestamps: true });

// Auto-generate invite code before saving
ChallengeSchema.pre('save', async function() {

  if (this.startDate && this.endDate) {
    const diff = this.endDate - this.startDate;
    this.duration = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
