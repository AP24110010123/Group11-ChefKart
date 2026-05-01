const express = require("express");
const router = express.Router();
const Subscription = require("../models/subscriptionModel");
const authenticate = require("../middlewares/authenticate");

router.get("/my", authenticate, async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.user._id }).sort("-createdAt").lean();
    res.json({ error: false, subscriptions: subs });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});


module.exports = router;
