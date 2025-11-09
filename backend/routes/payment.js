// backend/routes/payment.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // IMPORTANT: exact casing
const auth = require('../middleware/auth'); // ensure middleware file exists and is correctly cased

/**
 * Mock purchase endpoint.
 * In production: replace with a real payment gateway (Razorpay / Stripe) and verify via webhooks.
 *
 * POST /api/payment/purchase
 * Headers: Authorization: Bearer <token>
 * Body: { method: "card" | "upi" | ... } (optional)
 */
router.post('/purchase', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // mock charge succeeded
    user.isPremium = true;
    user.premiumSince = new Date();
    await user.save();

    return res.json({ success: true, message: 'Premium activated', user: { id: user._id, isPremium: user.isPremium } });
  } catch (err) {
    console.error('Payment purchase error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
