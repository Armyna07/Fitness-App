const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  dailyActivity: { type: String },
  pointsEarned: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Progress', ProgressSchema);