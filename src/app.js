const express = require('express');
const cors = require('cors');
const { authenticateFirebaseToken } = require('./middleware/firebaseAuth');
const app = express();

const pokemonRoutes = require('./routes/pokemon');
const searchRoutes = require('./routes/search');
const packRoutes = require('./routes/packs');
const tradeRoutes = require('./routes/trades');

// ✅ CORS fix — allow frontend origin
app.use(cors({
  origin: ['http://localhost:8081', ], // Add production URL here too when known
  credentials: true // Optional, if using cookies/auth headers
}));

app.use(express.json());

app.use('/api/pokemon', pokemonRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/packs', packRoutes);
app.use('/api/trades', tradeRoutes);
// app.use('/api/protected', authenticateFirebaseToken);
app.get('/api/test-auth', authenticateFirebaseToken, (req, res) => {
    res.status(200).json({ message: 'Firebase Auth Success', uid: req.user.uid });
});

app.get('/', (req, res) => res.send('PTCPokemon API Running'));

module.exports = app;