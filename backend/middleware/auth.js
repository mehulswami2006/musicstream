// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

module.exports = function (req, res, next) {
  const header = req.header('Authorization');
  const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // attach userId to request
    req.user = decoded; // { userId: ... }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
