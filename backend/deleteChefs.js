const mongoose = require("mongoose");
const Chef = require("./src/models/chefModel");
require("dotenv").config();

async function keepFirst10() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chefkart";
  await mongoose.connect(uri);
  console.log("MongoDB connected");

  // Get the first 10 chefs sorted by creation date
  const keep = await Chef.find().sort({ createdAt: 1 }).limit(10).select("_id name");

  if (keep.length === 0) {
    console.log("No chefs found in the database.");
    await mongoose.disconnect();
    return;
  }

  console.log("\nKeeping these 10 chefs:");
  keep.forEach((c, i) => console.log(`  ${i + 1}. ${c.name} (${c._id})`));

  const keepIds = keep.map((c) => c._id);

  const result = await Chef.deleteMany({ _id: { $nin: keepIds } });

  console.log(`\n✅ Deleted ${result.deletedCount} chefs.`);
  console.log(`✅ ${keep.length} chefs remain.`);

  await mongoose.disconnect();
  console.log("Done.");
}

keepFirst10().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
