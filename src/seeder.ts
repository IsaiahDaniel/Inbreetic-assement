import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import User from "./models/User.js";
import config from "./config/";
import bcrypt from "bcryptjs";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(config.mongodb.mongoUri);
    console.log("MongoDB connected");

    // Clear existing
    await Product.deleteMany({});
    await User.deleteMany({});

    // Seed Products
    const products = [
      { name: "Wireless Mouse", price: 29.99, stock: 100 },
      { name: "Mechanical Keyboard", price: 79.99, stock: 50 },
      { name: "HD Monitor", price: 149.99, stock: 30 },
      { name: "USB-C Charger", price: 19.99, stock: 200 },
    ];

    const createdProducts = await Product.insertMany(products);

    // Seed Users with hashed passwords
    const rawUsers = [
      {
        email: "alice@example.com",
        password: "password123",
        firstName: "Bob",
        lastName: "Alice",
        gender: "female",
      },
      {
        email: "stevejobs@example.com",
        password: "password456",
        firstName: "Steve",
        lastName: "Jobs",
        gender: "male",
      },
    ];

    const users = await Promise.all(
      rawUsers.map(async (user) => ({
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const createdUsers = await User.insertMany(users);

    console.log(
      "Seeded users:",
      createdUsers.map((u) => u.email)
    );
    console.log(
      "Seeded products:",
      createdProducts.map((p) => p.name)
    );

    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();
