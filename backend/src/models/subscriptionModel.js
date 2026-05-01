const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: {
      type: String,
      enum: ["starter", "popular", "premium"],
      required: true,
    },
    planDetails: {
      name: String,
      mealsPerDay: Number,
      daysPerWeek: Number,
      pricePerMonth: Number,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
    autoRenew: { type: Boolean, default: false },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySubscriptionId: { type: String },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
