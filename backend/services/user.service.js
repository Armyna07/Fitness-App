const User     = require('../models/User');
const Progress = require('../models/Progress');
 
const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) { const e = new Error('User not found'); e.statusCode = 404; throw e; }
  return user;
};
 
const updateProfile = async (userId, data) => {
  // Only allow safe fields — never allow password or email update here
  const allowed = {};
  if (data.displayName) allowed.displayName = data.displayName;
  if (data.avatar !== undefined) allowed.avatar = data.avatar;
  return User.findByIdAndUpdate(userId, allowed, { new: true, runValidators: true })
    .select('-password');
};
 
const getHistory = async (userId) => {
  return Progress
    .find({ user: userId })
    .populate('challenge', 'name type goalValue status startDate endDate')
    .select('challenge totalAmount currentStreak bestStreak rankSnapshot');
};
 
const getFriends = async (userId) => {
  const user = await User.findById(userId)
    .populate('friends', 'displayName username avatar challengesWon');
  if (!user) { const e = new Error('User not found'); e.statusCode = 404; throw e; }
  return user.friends;
};
 
const addFriend = async (userId, friendId) => {
  if (String(userId) === String(friendId)) {
    const e = new Error('Cannot add yourself'); e.statusCode = 400; throw e;
  }
  await User.findByIdAndUpdate(userId, { $addToSet: { friends: friendId } });
  await User.findByIdAndUpdate(friendId, { $addToSet: { friends: userId } });
};
 
const removeFriend = async (userId, friendId) => {
  await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
  await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
};
 
module.exports = { getProfile, updateProfile, getHistory, getFriends, addFriend, removeFriend };
