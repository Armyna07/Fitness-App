const mongoose = require('mongoose');

const FriendChallengeSchema = new mongoose.Schema({
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  opponent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('FriendChallenge', FriendChallengeSchema);