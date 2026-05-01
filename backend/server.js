const express = require("express");
const cors = require("cors");
const connect = require("./src/configs/db");
require("dotenv").config();



const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

// Routes
const authRouter = require("./src/routes/authRoutes");
const chefRouter = require("./src/routes/chefRoutes");
const bookingRouter = require("./src/routes/bookingRoutes");
const paymentRouter = require("./src/routes/paymentRoutes");
const subscriptionRouter = require("./src/routes/subscriptionRoutes");

app.use("/api/auth", authRouter);
app.use("/api/chefs", chefRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/subscriptions", subscriptionRouter);

app.get("/", (req, res) => res.json({ message: "ChefKart API v1.0" }));

app.listen(process.env.PORT || 8080, async () => {
  try {
    await connect();
    console.log(`ChefKart server started on port ${process.env.PORT || 8080}`);
  } catch (error) {
    console.log("Unable to start server:", error.message);
  }
});
