const jwt = require('jsonwebtoken');


// Middleware to allow only certain user roles

// Middleware to verify JWT and attach user info
const teacherAuth= function (req, res, next) {
  const authHeader = req.headers.authorization;
  

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const token = authHeader.split(' ')[1];
    //const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TEACHER);
   // if (!decoded || !decoded.teacher || !decoded.teacher.id) {
     // console.log("Invalid token structure", decoded);
      //return res.status(401).json({ msg: 'Invalid token structure' });
    //}
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('[Auth Middleware]', err.message);
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


module.exports = teacherAuth;

//axjssrfuweri