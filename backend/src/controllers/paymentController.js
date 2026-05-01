const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/bookingModel");
const Subscription = require("../models/subscriptionModel");
require("dotenv").config();

const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const error = new Error("Razorpay keys are missing in backend/.env");
    error.statusCode = 500;
    throw error;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const getErrorMessage = (error, fallback) => {
  if (error?.error?.description) return `${fallback}: ${error.error.description}`;
  if (error?.description) return `${fallback}: ${error.description}`;
  if (error?.message) return `${fallback}: ${error.message}`;
  return fallback;
};

// Create order for booking
const createBookingOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: true, message: "Booking not found" });

    const options = {
      amount: booking.totalAmount * 100, // paise
      currency: "INR",
      receipt: `booking_${bookingId}`,
      notes: { bookingId: bookingId.toString(), type: "booking" },
    };

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create(options);
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json({
      error: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: true,
      message: getErrorMessage(error, "Failed to create booking order"),
    });
  }
};

// Create order for subscription
const createSubscriptionOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const plans = {
      starter: { name: "Starter", mealsPerDay: 1, daysPerWeek: 5, pricePerMonth: 2999 },
      popular: { name: "Popular", mealsPerDay: 2, daysPerWeek: 6, pricePerMonth: 4999 },
      premium: { name: "Premium", mealsPerDay: 3, daysPerWeek: 7, pricePerMonth: 7999 },
    };

    if (!plans[plan]) return res.status(400).json({ error: true, message: "Invalid plan" });

    const planDetails = plans[plan];
    const shortUserId = req.user._id.toString().slice(-8);
    const options = {
      amount: planDetails.pricePerMonth * 100,
      currency: "INR",
      receipt: `sub_${shortUserId}_${Date.now()}`,
      notes: { userId: req.user._id.toString(), plan, type: "subscription" },
    };

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create(options);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const subscription = await Subscription.create({
      userId: req.user._id,
      plan,
      planDetails,
      startDate,
      endDate,
      razorpayOrderId: order.id,
    });

    res.json({
      error: false,
      orderId: order.id,
      subscriptionId: subscription._id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      planDetails,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: true,
      message: getErrorMessage(error, "Failed to create subscription order"),
    });
  }
};

// Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type, entityId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: true, message: "Payment verification failed" });
    }

    if (type === "booking") {
      await Booking.findByIdAndUpdate(entityId, {
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: "paid",
        status: "confirmed",
      });
    } else if (type === "subscription") {
      await Subscription.findByIdAndUpdate(entityId, {
        razorpayPaymentId: razorpay_payment_id,
        active: true,
      });
    }

    res.json({ error: false, message: "Payment verified successfully" });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: true,
      message: getErrorMessage(error, "Failed to verify payment"),
    });
  }
};

module.exports = { createBookingOrder, createSubscriptionOrder, verifyPayment };
