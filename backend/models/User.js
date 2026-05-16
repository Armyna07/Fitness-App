const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  // ── AUTHENTICATION ──────────────────────────────
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  displayName: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  // ── PROFILE ─────────────────────────────────────
  avatar: {
    type: String,
    default: null
  },

  // ── SCORING ─────────────────────────────────────
  points: {
    type: Number,
    default: 0
  },

  // ── ALL-TIME STATS (MVP requirement LB-10) ──────
  challengesWon: {
    type: Number,
    default: 0
  },

  challengesParticipated: {
    type: Number,
    default: 0
  },

  // ── SOCIAL ──────────────────────────────────────
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
