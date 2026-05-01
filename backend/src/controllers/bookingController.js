const Booking = require("../models/bookingModel");
const Chef = require("../models/chefModel");

const createBooking = async (req, res) => {
  try {
    const { chefId, date, endDate, mealType, guestCount, specialRequirements, address } = req.body;

    const chef = await Chef.findById(chefId);
    if (!chef) return res.status(404).json({ error: true, message: "Chef not found" });

    const days = endDate
      ? Math.ceil((new Date(endDate) - new Date(date)) / (1000 * 60 * 60 * 24)) + 1
      : 1;
    const totalAmount = chef.pricePerDay * days;

    const booking = await Booking.create({
      userId: req.user._id,
      chefId,
      date,
      endDate,
      mealType,
      guestCount,
      specialRequirements,
      address,
      totalAmount,
    });

    res.status(201).json({ error: false, booking });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("chefId", "name profileImage cuisines rating")
      .sort("-createdAt")
      .lean();
    res.json({ error: false, bookings });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ error: true, message: "Booking not found" });
    booking.status = "cancelled";
    await booking.save();
    res.json({ error: false, message: "Booking cancelled" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = { createBooking, getUserBookings, cancelBooking };
