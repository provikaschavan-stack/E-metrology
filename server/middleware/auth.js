const { verifyToken } = require('../utils/jwt.utils');

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing or invalid Authorization header. Expected Bearer <token>'
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired JWT token'
    });
  }

  req.user = decoded;
  next();
}

module.exports = {
  authenticateJWT
};
