const express = require('express');
const axios = require('axios');
const router = express.Router();

const PACK_CONFIG = {
  1: { rarity: 'Common', set: 'swsh1' },
  2: { rarity: 'Uncommon', set: 'swsh1' },
  3: { rarity: 'Rare', set: 'swsh1' },
};

// GET /api/packs/:packId
router.get('/:packId', async (req, res) => {
  const { packId } = req.params;
  const config = PACK_CONFIG[packId];

  if (!config) {
    return res.status(400).json({ error: 'Invalid pack ID. Choose 1, 2, or 3.' });
  }

  const query = `rarity:"${config.rarity}" AND set.id:"${config.set}"`;

  try {
    const response = await axios.get(
      `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&pageSize=50`,
      {
        headers: {
          'X-Api-Key': process.env.POKEMON_TCG_API_KEY,
        },
      }
    );

    const cards = response.data.data;

    if (!cards || cards.length === 0) {
      return res.status(404).json({ error: 'No cards found for this pack.' });
    }

    // Randomly pick 5 cards
    const shuffled = cards.sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, 5);

    res.json(selectedCards);
  } catch (error) {
    console.error('Error fetching cards:', error.message);
    res.status(500).json({ error: 'Failed to fetch cards from Pokémon TCG API' });
  }
});

module.exports = router;