const admin = require('../../config/firebase.config');

async function authenticateFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split('Bearer ')[1];

  if (!token) {
    console.error('🚫 No token provided');
    return res.status(401).send('Unauthorized');
  }

  try {
    console.log('🔐 Verifying token:', token.slice(0, 40) + '...'); // Just logs first part
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    console.log('✅ Authenticated UID:', decoded.uid);
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(401).send('Invalid token');
  }
}

module.exports = { authenticateFirebaseToken };