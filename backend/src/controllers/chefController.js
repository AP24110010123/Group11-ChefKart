const Chef = require("../models/chefModel");

const getAllChefs = async (req, res) => {
  try {
    const { city, cuisine, minRating, maxPrice, page = 1, size = 10, sort = "-rating" } = req.query;
    const query = {};
    if (city) query.city = new RegExp(city, "i");
    if (cuisine) query.cuisines = { $in: [new RegExp(cuisine, "i")] };
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (maxPrice) query.pricePerDay = { $lte: parseInt(maxPrice) };
    query.available = true;

    const chefs = await Chef.find(query)
      .sort(sort)
      .skip((page - 1) * size)
      .limit(parseInt(size))
      .select("-reviews")
      .lean();

    const total = await Chef.countDocuments(query);
    res.json({ error: false, chefs, total, page: parseInt(page), totalPages: Math.ceil(total / size) });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const getChefById = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id).lean();
    if (!chef) return res.status(404).json({ error: true, message: "Chef not found" });
    res.json({ error: false, chef });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const chef = await Chef.findById(req.params.id);
    if (!chef) return res.status(404).json({ error: true, message: "Chef not found" });

    chef.reviews.push({ userId: req.user._id, name: req.user.name, comment, rating });
    const total = chef.reviews.reduce((sum, r) => sum + r.rating, 0);
    chef.rating = (total / chef.reviews.length).toFixed(1);
    chef.totalReviews = chef.reviews.length;
    await chef.save();
    res.json({ error: false, message: "Review added" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const createChef = async (req, res) => {
  try {
    const chef = await Chef.create(req.body);
    res.status(201).json({ error: false, chef });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = { getAllChefs, getChefById, addReview, createChef };
