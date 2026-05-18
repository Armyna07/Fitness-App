const router = require('express').Router();
const challengeController = require('../controllers/challenge.controller');
// const logController = require('../controllers/log.controller');
// const lbCtrl = require('../controllers/leaderboard.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createChallengeSchema, editChallengeSchema } = require('../schemas/challenge.schemas');
// const { submitLogSchema } = require('../schemas/log.schemas');

// Challenge CRUD
router.post('/', protect, validate(createChallengeSchema), challengeController.create);
router.get('/', challengeController.getAllPublic);
router.get('/mine', protect, challengeController.getMine);
router.get('/:id', protect, challengeController.getOne);
router.patch('/:id', protect, validate(editChallengeSchema), challengeController.edit);
router.delete('/:id', protect, challengeController.remove);
 
// Join / leave
router.post('/:id/join', protect, challengeController.joinById);
router.post('/join/:code', protect, challengeController.joinByCode);
router.delete('/:id/leave', protect, challengeController.leave);
 
// not done yett >

// // Leaderboard sub-routes
// router.get('/:id/leaderboard', protect, lbCtrl.getCumulative);
// router.get('/:id/leaderboard/today', protect, lbCtrl.getToday);
// router.get('/:id/leaderboard/archive', protect, lbCtrl.getArchive);
 
// // Log entry sub-routes
// router.post('/:id/logs', protect, validate(submitLogSchema), logController.submit);
// router.get ('/:id/logs', protect, logController.getForChallenge);
// router.get ('/:id/logs/me', protect, logController.getMyLogs);
 
// progress ??? logg


module.exports = router;
