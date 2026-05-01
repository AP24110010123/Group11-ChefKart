const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chefkart";
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

module.exports = connect;
