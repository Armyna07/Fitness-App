const mongoose = require('mongoose');
 
const UserSchema = new mongoose.Schema({
  username:    { type: String, required: true, unique: true, trim: true },
  displayName: { type: String, trim: true, default: '' },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true },
  avatar:      { type: String, default: null },
  points:      { type: Number, default: 0 },
  challengesWon:         { type: Number, default: 0 },
  challengesParticipated: { type: Number, default: 0 },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{
  from:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:    { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
}],
}, { timestamps: true });
 
module.exports = mongoose.model('User', UserSchema);
