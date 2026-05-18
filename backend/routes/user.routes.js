const router      = require('express').Router();
const ctrl        = require('../controllers/user.controller');
const { protect }  = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { updateProfileSchema } = require('../schemas/user.schemas');
 
router.get   ('/:id',              ctrl.getProfile);
router.patch ('/me',               protect, validate(updateProfileSchema), ctrl.updateProfile);
router.get   ('/me/history',       protect, ctrl.getHistory);
router.get   ('/me/friends',       protect, ctrl.getFriends);
router.post  ('/me/friends/:friendId', protect, ctrl.addFriend);
router.delete('/me/friends/:friendId', protect, ctrl.removeFriend);
 
module.exports = router;
