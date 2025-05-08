const express = require('express');
const router = express.Router();
const { UserCard } = require('../models');
const { authenticateFirebaseToken } = require('../middleware/firebaseAuth'); // adjust path

// GET /api/collection
router.get('/', authenticateFirebaseToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    const userCards = await UserCard.findAll({
      where: { userId },
    });

    res.json(userCards);
  } catch (err) {
    console.error('Error fetching collection:', err.message);
    res.status(500).json({ error: 'Failed to fetch user collection' });
  }
});

module.exports = router;