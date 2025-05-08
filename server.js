require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    res.json(response.data);
  } catch (error) {
    console.error('PokéAPI fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Pokémon data' });
  }
});

module.exports = router;

console.log("ENV VARS:", {
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
});
const app = require('./src/app');

// HEALTH ROUTE
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    database: sequelize?.config?.database || 'unknown'
  });
});

const { sequelize } = require('./src/models');
const PORT = process.env.PORT || 5000;

console.log("Connecting to DB:", process.env.DB_HOST);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    await sequelize.sync();
    console.log('Tables synced.');

    const [tables] = await sequelize.query("SHOW TABLES;");
    console.log('Tables in DB:', tables.map(t => Object.values(t)[0]));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to DB:', err);
  }
})();
