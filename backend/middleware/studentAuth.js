const jwt = require('jsonwebtoken');

const studentAuth = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const token = authHeader.split(' ')[1];

    // Check if the token has a valid structure (JWT format)
    // if (!token || token.split('.').length !== 3) {
    //   return res.status(401).json({ msg: 'Malformed token, authorization denied' });
    // }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_STUDENT);
    req.user = decoded.user;
    next();
  
  } catch (err) {
    console.error('[Auth Middleware] Error:', err.message);

    // Specific error handling based on the jwt error type
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Token is malformed or invalid' });
    }

    // Handle other JWT errors like token expiration
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired' });
    }

    res.status(500).json({ msg: 'Internal server error, please try again' });
  }
};

module.exports = studentAuth;
