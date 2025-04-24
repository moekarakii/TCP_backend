const express = require('express');
const cors = require('cors');
const { authenticateFirebaseToken } = require('./middleware/firebaseAuth');
const app = express();

app.use(cors());
app.use(express.json());

// Routes (to be implemented later)
// app.use('/collectors', require('./routes/collectorRoutes'));
// app.use('/trade', require('./routes/tradeRoutes'));
// app.use('/showcase', require('./routes/showcaseRoutes'));

app.get('/', (req, res) => res.send('PTCPokemon API Running'));

module.exports = app;
