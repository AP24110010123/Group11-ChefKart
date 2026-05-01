const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chefId: { type: mongoose.Schema.Types.ObjectId, ref: "Chef", required: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    mealType: { type: String, enum: ["breakfast", "lunch", "dinner", "all-day"], required: true },
    guestCount: { type: Number, default: 2 },
    specialRequirements: { type: String },
    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
