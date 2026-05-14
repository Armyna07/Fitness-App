const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  rules: { type: String },
  duration: { type: Number, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Challenge', ChallengeSchema);