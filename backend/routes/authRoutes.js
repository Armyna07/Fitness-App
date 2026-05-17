const authRouter = require('express').Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
// const { authLimiter } = require('../middleware/rateLimiter');
const { registerSchema, loginSchema } = require('../schemas/auth.schemas');
 
authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);

// not sure why they're here yet
authRouter.post('/logout', protect, authController.logout);
authRouter.get ('/me', protect, authController.me);

module.exports = authRouter;
