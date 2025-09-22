// authMiddleware.js
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.headers['token'];

  if (!token) {
    return res.status(401).json({ status: 'Unauthorized', message: 'Token missing' });
  }  

  jwt.verify(token, 'secret123', (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 'Unauthorized' });
    }

    req.headers.email = decoded.data;
    next();
  });
};

export default authMiddleware;
