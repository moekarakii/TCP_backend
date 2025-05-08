const express = require('express');
const router = express.Router();
const { UserCard, Card } = require('../models');
const { authenticateFirebaseToken } = require('../middleware/firebaseAuth');

// GET /api/collection
router.get('/', authenticateFirebaseToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    const collection = await UserCard.findAll({
      where: { userId },
      include: [
        {
          model: Card,
          attributes: ['id', 'name', 'rarity', 'imageUrl'], // You can expand this as needed
        },
      ],
    });

    // Flatten the response to match frontend expectations
    const formatted = collection.map((entry) => ({
      id: entry.Card.id,
      name: entry.Card.name,
      rarity: entry.Card.rarity,
      images: { large: entry.Card.imageUrl },
      quantity: entry.quantity,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Failed to fetch collection:', error.message);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

module.exports = router;