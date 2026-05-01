const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const newToken = (user) =>
  jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "7d" });

// REGISTER
const register = async (req, res) => {
  try {
    const existing = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existing) {
      return res.status(409).json({
        error: true,
        message: "Username or email already exists",
      });
    }

    const user = await User.create(req.body);
    const token = newToken(user);

    res.status(201).json({
      error: false,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "User not found",
      });
    }

    const match = user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).json({
        error: true,
        message: "Invalid password",
      });
    }

    const token = newToken(user);

    res.status(200).json({
      error: false,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

// PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .lean();

    res.json({ error: false, user });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

module.exports = { register, login, getProfile };