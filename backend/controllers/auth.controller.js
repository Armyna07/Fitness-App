const authService = require('../services/auth.service');
 
const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ user, token });
  } catch (err) { next(err); }
};
 
const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ user, token });
  } catch (err) { next(err); }
};
 
const logout = (_req, res) => {
  // JWT is stateless — client discards the token
  res.json({ message: 'Logged out' });
};
 
const me = (req, res) => res.json({ user: req.user });
 
module.exports = { register, login, logout, me };
