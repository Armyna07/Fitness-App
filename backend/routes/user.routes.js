const router     = require('express').Router();
const ctrl       = require('../controllers/user.controller');
const { protect }  = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { updateProfileSchema } = require('../schemas/user.schemas');
 
// FIX #22: /me routes MUST come before /:id — otherwise Express treats 'me' as an ObjectId
router.get   ('/me',               protect, ctrl.getMe);
router.patch ('/me',               protect, validate(updateProfileSchema), ctrl.updateProfile);
router.get   ('/me/history',       protect, ctrl.getHistory);
router.get   ('/me/friends',       protect, ctrl.getFriends);
router.post  ('/me/friends/:friendId', protect, ctrl.addFriend);
router.delete('/me/friends/:friendId', protect, ctrl.removeFriend);
router.get   ('/me/friend-requests',                    protect, ctrl.getPendingRequests);
router.post  ('/me/friend-requests/:toId',              protect, ctrl.sendFriendRequest);
router.patch ('/me/friend-requests/:requestId/accept',  protect, ctrl.acceptFriendRequest);
router.patch ('/me/friend-requests/:requestId/decline', protect, ctrl.declineFriendRequest);
 
// ADD: user search endpoint used by FriendsPage search tab
router.get('/search', protect, ctrl.searchUsers);
 
// Dynamic :id last
router.get('/:id', ctrl.getProfile);
 
module.exports = router;
