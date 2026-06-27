const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const User = require("./models/User");

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI not found in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("An admin user already exists:");
      console.log(`Name: ${existingAdmin.name}`);
      console.log(`Email: ${existingAdmin.email}`);
      console.log("If you forgot the password, you can update it using this script.");
    }

    const adminEmail = "admin@placement.com";
    const adminPassword = "adminpassword123";

    // Let's upsert an admin account
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const updatedAdmin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isActive: true,
      },
      { upsert: true, new: true }
    );

    console.log("\nAdmin credentials configured:");
    console.log(`Email: ${updatedAdmin.email}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role: ${updatedAdmin.role}`);

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
