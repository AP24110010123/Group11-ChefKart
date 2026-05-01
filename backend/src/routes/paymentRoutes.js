const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const {
  createBookingOrder,
  createSubscriptionOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/booking-order", authenticate, createBookingOrder);
router.post("/subscription-order", authenticate, createSubscriptionOrder);
router.post("/verify", authenticate, verifyPayment);

module.exports = router;
