const express = require('express');
const { Op } = require('sequelize'); // for OR condition
const { Trade, UserCard, Card, User } = require('../models');
const { authenticateFirebaseToken } = require('../middleware/firebaseAuth');
const router = express.Router();

router.post('/', authenticateFirebaseToken, async (req, res) => {
  const { receivingUserId, offeredCardId, requestedCardId } = req.body;
  const offeringUserId = req.user.uid;

  console.log("🔁 Incoming trade request:", {
    offeringUserId,
    receivingUserId,
    offeredCardId,
    requestedCardId
  });

  if (receivingUserId === offeringUserId) {
    console.warn("⚠️ Trade blocked: user tried to trade with themselves.");
    return res.status(400).json({ message: "You cannot trade with yourself." });
  }

  try {
    // Step 1: Validate offered card ownership
    const userCard = await UserCard.findOne({
      where: { userId: offeringUserId, cardId: offeredCardId }
    });

    if (!userCard) {
      console.warn(`❌ No userCard found for user ${offeringUserId} and card ${offeredCardId}`);
      return res.status(400).json({ message: "You don't own this card." });
    }

    if (userCard.quantity < 1) {
      console.warn(`❌ userCard quantity is too low: ${userCard.quantity}`);
      return res.status(400).json({ message: "You don't own this card." });
    }

    console.log("✅ Ownership verified:", userCard.toJSON());

    // Step 2: Create the trade
    const trade = await Trade.create({
      offeringUserId,
      receivingUserId,
      offeredCardId,
      requestedCardId,
      status: 'pending'
    });

    console.log("📦 Trade successfully created:", trade.toJSON());
    res.status(201).json(trade);

  } catch (err) {
    console.error('❌ Trade creation error:', err);
    res.status(500).json({ message: 'Failed to create trade.' });
  }
});

// GET /api/trades/forum
router.get('/forum', async (req, res) => {
  try {
    const trades = await Trade.findAll({
      where: { status: 'pending' },
      include: [
        { model: Card, as: 'offeredCard' },
        { model: Card, as: 'requestedCard' },
        { model: User, as: 'offeringUser', attributes: ['uid', 'email'] },
      ],
    });

    res.json(trades);
  } catch (error) {
    console.error('Error fetching public trades:', error);
    res.status(500).json({ message: 'Failed to fetch trades' });
  }
});

router.get('/:userId', authenticateFirebaseToken, async (req, res) => {
  const { userId } = req.params;

  if (req.user.uid !== userId) {
    return res.status(403).json({ message: 'You are not authorized to view these trades.' });
  }

  try {
    const trades = await Trade.findAll({
      where: {
        [Op.or]: [
          { offeringUserId: userId },
          { receivingUserId: userId }
        ]
      }
    });

    res.json(trades);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trades.' });
  }
});

router.put('/:tradeId/accept', authenticateFirebaseToken, async (req, res) => {
  const { tradeId } = req.params;

  try {
    const trade = await Trade.findByPk(tradeId);
    if (!trade || trade.status !== 'pending') {
      return res.status(404).json({ message: 'Trade not found or already processed.' });
    }

    const { offeringUserId, receivingUserId, offeredCardId, requestedCardId } = trade;

    // Only receivingUser can accept the trade
    if (req.user.uid !== receivingUserId) {
      return res.status(403).json({ message: 'You are not authorized to accept this trade.' });
    }

    const receiverHasCard = await UserCard.findOne({
      where: { userId: receivingUserId, cardId: requestedCardId }
    });

    if (!receiverHasCard || receiverHasCard.quantity < 1) {
      return res.status(400).json({ message: 'Receiving user does not own the requested card.' });
    }

    const [offeringUserCard, receivingUserCard] = await Promise.all([
      UserCard.findOne({ where: { userId: offeringUserId, cardId: offeredCardId } }),
      UserCard.findOne({ where: { userId: receivingUserId, cardId: requestedCardId } })
    ]);

    if (!offeringUserCard || offeringUserCard.quantity < 1 || !receivingUserCard || receivingUserCard.quantity < 1) {
      return res.status(400).json({ message: 'One of the users no longer owns the card.' });
    }

    await Promise.all([
      offeringUserCard.decrement('quantity'),
      receivingUserCard.decrement('quantity')
    ]);

    await Promise.all([
      UserCard.upsert({ userId: receivingUserId, cardId: offeredCardId, quantity: 1 }),
      UserCard.upsert({ userId: offeringUserId, cardId: requestedCardId, quantity: 1 })
    ]);

    trade.status = 'accepted';
    await trade.save();

    res.json({ message: 'Trade accepted and cards swapped.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing trade.' });
  }
});

router.delete('/:tradeId', authenticateFirebaseToken, async (req, res) => {
  const { tradeId } = req.params;

  try {
    const trade = await Trade.findByPk(tradeId);
    if (!trade) return res.status(404).json({ message: 'Trade not found.' });

    if (![trade.offeringUserId, trade.receivingUserId].includes(req.user.uid)) {
      return res.status(403).json({ message: 'You are not authorized to cancel this trade.' });
    }

    trade.status = 'cancelled';
    await trade.save();

    res.json({ message: 'Trade cancelled.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel trade.' });
  }
});

module.exports = router;