const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/pokemon/:name
router.get('/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const response = await axios.get(`https://api.pokemontcg.io/v2/cards?q=name:${name}`, {
      headers: {
        'X-Api-Key': process.env.POKEMON_TCG_API_KEY
      }
    });

    if (!response.data || response.data.data.length === 0) {
      return res.status(404).json({ message: 'No cards found for this Pokémon.' });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Failed to fetch from Pokémon TCG API:', error.message);
    res.status(500).json({ error: 'Failed to fetch Pokémon card data' });
  }
});

module.exports = router;