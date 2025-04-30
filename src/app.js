const express = require('express');
const cors = require('cors');
const { authenticateFirebaseToken } = require('./middleware/firebaseAuth');
const app = express();

const pokemonRoutes = require('./routes/pokemon');

app.use(cors());
app.use(express.json());

app.use('/api/pokemon', pokemonRoutes);
app.use('/api/protected', authenticateFirebaseToken);
app.get('/api/test-auth', authenticateFirebaseToken, (req, res) => {
    res.status(200).json({ message: 'Firebase Auth Success', uid: req.user.uid });
});

app.get('/', (req, res) => res.send('PTCPokemon API Running'));

module.exports = app;