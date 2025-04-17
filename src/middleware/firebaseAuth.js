const admin = require('../../config/firebase.config');

async function authenticateFirebaseToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).send('Unauthorized');

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
}

module.exports = { authenticateFirebaseToken };