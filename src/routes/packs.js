const express = require('express');
const axios = require('axios');
const router = express.Router();
const { UserCard } = require('../models');
const { Card } = require('../models');
const { User } = require('../models');
const { authenticateFirebaseToken } = require('../middleware/firebaseAuth');

// Packs are here
const PACK_CONFIG = {
  1: { rarity: 'Common', set: 'swsh1' },
  2: { rarity: 'Uncommon', set: 'swsh1' },
  3: { rarity: 'Rare', set: 'swsh1' },
};

// GET /api/packs/:packId (ex:api/packs/1)
router.get('/:packId', authenticateFirebaseToken, async (req, res) => {
  const { packId } = req.params;
  const config = PACK_CONFIG[packId];
  const userId = req.user.uid;

  // Ensure user exists in Users table
  await User.findOrCreate({
    where: { uid: userId },
    defaults: {
      email: req.user.email || 'unknown@example.com',
      displayName: req.user.name || null,
    },
  });

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

    // Randomly select 5 cards
    const shuffled = cards.sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, 5);

    // This is where the saving to user starts
    // Save each card to the UserCard table
    for (const card of selectedCards) {
      await Card.findOrCreate({
        where: { id: card.id },
        defaults: {
          name: card.name,
          rarity: card.rarity || 'Common',
          imageUrl: card.images?.small || '',
        },
      });

      const existing = await UserCard.findOne({
        where: { userId, cardId: card.id },
      });

      if (existing) {
        existing.quantity += 1;
        await existing.save();
      } else {
        await UserCard.create({
          userId,
          cardId: card.id,
          quantity: 1,
        });
      }
    }

    res.json(selectedCards);
  } catch (error) {
    console.error('Error opening pack:', error.message);
    res.status(500).json({ error: 'Failed to open pack and save cards.' });
  }
});

module.exports = router;