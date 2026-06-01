const userService = require('../services/user.service');
 
const getProfile = async (req, res, next) => {
  try { res.json({ user: await userService.getProfile(req.params.id) }); }
  catch (err) { next(err); }
};
 
const updateProfile = async (req, res, next) => {
  try { res.json({ user: await userService.updateProfile(req.user._id, req.body) }); }
  catch (err) { next(err); }
};
 
const getHistory = async (req, res, next) => {
  try { res.json({ history: await userService.getHistory(req.user._id) }); }
  catch (err) { next(err); }
};
 
const getFriends = async (req, res, next) => {
  try { res.json({ friends: await userService.getFriends(req.user._id) }); }
  catch (err) { next(err); }
};
 
const addFriend = async (req, res, next) => {
  try {
    await userService.addFriend(req.user._id, req.params.friendId);
    res.json({ message: 'Friend added' });
  } catch (err) { next(err); }
};
 
const removeFriend = async (req, res, next) => {
  try {
    await userService.removeFriend(req.user._id, req.params.friendId);
    res.json({ message: 'Friend removed' });
  } catch (err) { next(err); }
};

const User = require('../models/User');

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  res.json(user);
};

// ADD to backend/controllers/user.controller.js
const searchUsers = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    if (q.length < 2) return res.json({ users: [] });
    const users = await userService.searchUsers(q);
    res.json({ users });
  } catch (err) { next(err); }
};

const sendFriendRequest = async (req, res, next) => {
  try {
    await userService.sendFriendRequest(req.user._id, req.params.toId);
    res.json({ message: 'Friend request sent' });
  } catch (err) { next(err); }
};

const acceptFriendRequest = async (req, res, next) => {
  try {
    await userService.acceptFriendRequest(req.user._id, req.params.requestId);
    res.json({ message: 'Friend request accepted' });
  } catch (err) { next(err); }
};

const declineFriendRequest = async (req, res, next) => {
  try {
    await userService.declineFriendRequest(req.user._id, req.params.requestId);
    res.json({ message: 'Friend request declined' });
  } catch (err) { next(err); }
};

const getPendingRequests = async (req, res, next) => {
  try {
    const requests = await userService.getPendingRequests(req.user._id);
    res.json({ requests });
  } catch (err) { next(err); }
};
 
// Update exports line:
module.exports = { getProfile, updateProfile, getHistory, getFriends, addFriend, removeFriend, getMe, searchUsers, sendFriendRequest, acceptFriendRequest, declineFriendRequest, getPendingRequests };


 

