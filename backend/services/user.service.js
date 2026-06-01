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

const searchUsers = async (query) => {
  const regex = new RegExp(query, "i");
  return User.find({
    $or: [{ username: regex }, { displayName: regex }]
  })
  .select("displayName username avatar challengesWon")
  .limit(20);
};

const sendFriendRequest = async (fromId, toId) => {
  if (String(fromId) === String(toId)) {
    const e = new Error('Cannot send request to yourself'); e.statusCode = 400; throw e;
  }
  const toUser = await User.findById(toId);
  if (!toUser) { const e = new Error('User not found'); e.statusCode = 404; throw e; }

  const alreadyFriends = toUser.friends.some(f => String(f) === String(fromId));
  if (alreadyFriends) { const e = new Error('Already friends'); e.statusCode = 409; throw e; }

  const alreadySent = toUser.friendRequests.some(
    r => String(r.from) === String(fromId) && r.status === 'pending'
  );
  if (alreadySent) { const e = new Error('Friend request already sent'); e.statusCode = 409; throw e; }

  await User.findByIdAndUpdate(toId, {
    $push: { friendRequests: { from: fromId } }
  });
};

const acceptFriendRequest = async (userId, requestId) => {
  const user = await User.findById(userId);
  if (!user) { const e = new Error('User not found'); e.statusCode = 404; throw e; }
  const req = user.friendRequests.id(requestId);
  if (!req) { const e = new Error('Request not found'); e.statusCode = 404; throw e; }
  if (req.status !== 'pending') { const e = new Error('Already handled'); e.statusCode = 400; throw e; }
  req.status = 'accepted';
  await user.save();
  await User.findByIdAndUpdate(userId,   { $addToSet: { friends: req.from } });
  await User.findByIdAndUpdate(req.from, { $addToSet: { friends: userId } });
};

const declineFriendRequest = async (userId, requestId) => {
  const user = await User.findById(userId);
  if (!user) { const e = new Error('User not found'); e.statusCode = 404; throw e; }
  const req = user.friendRequests.id(requestId);
  if (!req) { const e = new Error('Request not found'); e.statusCode = 404; throw e; }
  req.status = 'declined';
  await user.save();
};

const getPendingRequests = async (userId) => {
  const user = await User.findById(userId)
    .populate('friendRequests.from', 'displayName username avatar');
  if (!user) { const e = new Error('User not found'); e.statusCode = 404; throw e; }
  return user.friendRequests.filter(r => r.status === 'pending');
};

 
module.exports = {
  getProfile, updateProfile, getHistory, getFriends, addFriend, removeFriend, searchUsers,
  sendFriendRequest, acceptFriendRequest, declineFriendRequest, getPendingRequests
};
