const mongoose = require("mongoose");
require("dotenv").config();

const connect = require("./configs/db");
const Chef = require("./models/chefModel");

const names = [
  "Raj", "Amit", "Priya", "Anjali", "Vikram", "Neha", "Arjun", "Kiran", "Ravi", "Sneha",
  "Rahul", "Pooja", "Manoj", "Divya", "Suresh", "Kavya", "Rohit", "Meena", "Ajay", "Nisha"
];

const cuisinesList = [
  "Indian", "Chinese", "Italian", "South Indian", "North Indian",
  "Continental", "Thai", "Mexican"
];

const cities = ["Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateChef(i) {
  const name = randomItem(names);

  return {
    name,
    email: `chef${i}@mail.com`,
    mobile: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
    bio: "Professional chef with experience in multiple cuisines.",
    experience: Math.floor(Math.random() * 10) + 1,
    cuisines: [randomItem(cuisinesList)],
    specialDishes: ["Special Dish " + (i + 1)],
    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
    totalReviews: Math.floor(Math.random() * 100),
    images: [],
    profileImage: "",
    pricePerDay: Math.floor(Math.random() * 1000) + 300,
    available: true,
    city: randomItem(cities),
    verifiedChef: Math.random() > 0.5,
  };
}

async function seedChefs() {
  try {
    await connect();

    console.log("Deleting old chefs...");
    await Chef.deleteMany();

    console.log("Seeding new chefs...");

    const chefs = [];
    for (let i = 0; i < 50; i++) {
      chefs.push(generateChef(i));
    }

    await Chef.insertMany(chefs);

    console.log("✅ 50 chefs added successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedChefs();