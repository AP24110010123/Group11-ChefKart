const express = require("express");
const router = express.Router();

const {
  getAllChefs,
  getChefById,
  addReview,
  createChef,
} = require("../controllers/chefController");
const authenticate = require("../middlewares/authenticate");

router.get("/", getAllChefs);
router.get("/:id", getChefById);
router.post("/", createChef);
router.post("/:id/review", authenticate, addReview);

module.exports = router;
