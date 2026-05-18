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
 
module.exports = { getProfile, updateProfile, getHistory, getFriends, addFriend, removeFriend };
