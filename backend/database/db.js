// database/db.js – MongoDB connection via Mongoose
import mongoose from "mongoose";
import config from "../config.js";

export async function connectDb() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("✅ Connected to MongoDB:", mongoose.connection.name);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

export function getDb() {
  return mongoose.connection;
}
