const mongoose = require('mongoose');

// Schema for each opponent's individual response
const ResponseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  respondedAt: {
    type: Date,
    default: null
  }
}, { _id: false });

const FriendChallengeSchema = new mongoose.Schema({

  // ── LINKS ────────────────────────────────────────
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },

  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // ── OPPONENTS (supports groups) ───────────────────
  opponents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Each opponent's individual response
  responses: [ResponseSchema],

  // ── STATUS ───────────────────────────────────────
  // pending — waiting for responses
  // active — at least one accepted
  // completed — challenge ended and winner determined
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending'
  },

  // ── RESULT ───────────────────────────────────────
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Full ranked results when completed
  finalRankings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rank: Number,
    totalAmount: Number
  }]

}, { timestamps: true });

// Helper — get all participants including initiator
FriendChallengeSchema.methods.getAllParticipants = function() {
  return [this.initiator, ...this.opponents];
};

// Helper — check if all opponents responded
FriendChallengeSchema.methods.allResponded = function() {
  return this.responses.every(r => r.status !== 'pending');
};

// Helper — check if at least one accepted
FriendChallengeSchema.methods.anyAccepted = function() {
  return this.responses.some(r => r.status === 'accepted');
};

module.exports = mongoose.model('FriendChallenge', FriendChallengeSchema);
