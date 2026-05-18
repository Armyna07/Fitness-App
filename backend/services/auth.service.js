const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // improvement: move hashing to model.pre middleware to prevent errors
const User = require('../models/User');
 
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
 
const register = async ({ displayName, username, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already in use'); err.statusCode = 409; throw err;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ displayName, username, email, password: passwordHash });
  const token = generateToken(user._id);
  return { user, token };
};
 
// need to include check for duplicater usernames

const login = async ({ login, password }) => {

  const user = await User.findOne({
    $or: [
      { email: login },
      { username: login.toLowerCase() }
    ]
  });
  console.log(user);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const err = new Error('Invalid email or password'); err.statusCode = 401; throw err;
  }
  const token = generateToken(user._id);
  return { user, token };
};
 
module.exports = { register, login };