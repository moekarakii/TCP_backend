const { initializeApp, getApps } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirebaseConfig } = require('../utils/firebaseConfig');

const firebaseConfig = getFirebaseConfig();

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const email = 'test2@gmail.com'; // <-- replace
const password = 'test2account';      // <-- replace

const auth = getAuth();

signInWithEmailAndPassword(auth, email, password)
  .then(userCred => userCred.user.getIdToken())
  .then(token => console.log('\n✅ Firebase ID token:\n', token))
  .catch(err => console.error('\n❌ Error getting token:', err.message));
