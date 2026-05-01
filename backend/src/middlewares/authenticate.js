const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: true,
      message: "Token not provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ IMPORTANT FIX (matches your token structure)
    req.user = decoded.user;

    return next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticate;
