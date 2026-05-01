const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    bio: { type: String },
    experience: { type: Number, required: true },
    categories: [{ type: String }],
    cuisines: [{ type: String }],
    specialDishes: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        comment: String,
        rating: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    images: [{ type: String }],
    profileImage: { type: String },
    pricePerDay: { type: Number, required: true },
    available: { type: Boolean, default: true },
    city: { type: String, required: true },
    verifiedChef: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Chef", chefSchema);
