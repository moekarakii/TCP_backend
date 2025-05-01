const express = require('express');
const axios = require('axios');
const router = express.Router();
// GET /api/pokemon/search?name=Pikachu&rarity=Rare Holo
router.get('/search', async (req, res) => {
  const { name, rarity } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Missing Pokémon name in query' });
  }

  const nameQuery = `name:"${name.trim()}"`;
  const rarityQuery = rarity ? ` AND rarity:"${rarity}"` : '';
  const query = nameQuery + rarityQuery;

  try {
    const response = await axios.get(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}`, {
      headers: {
        'X-Api-Key': process.env.POKEMON_TCG_API_KEY
      }
    });

    if (!response.data || response.data.data.length === 0) {
      return res.status(404).json({ message: 'No cards found for this query.' });
    }

    res.json(response.data.data.slice(0, 8)); // Limit to top 8 results
  } catch (error) {
    console.error('Pokémon TCG API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch card data' });
  }
});
