const router = require('express').Router();
const fcController = require('../controllers/friendChallenge.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { sendFriendChallengeSchema, respondSchema } = require('../schemas/friendChallenge.schemas');
 
router.post('/', protect, validate(sendFriendChallengeSchema), fcController.send);
router.get ('/mine', protect, fcController.getMine);
router.get ('/:id', protect, fcController.getOne);
router.post('/:id/respond',protect, validate(respondSchema),             fcController.respond);
 
module.exports = router;
