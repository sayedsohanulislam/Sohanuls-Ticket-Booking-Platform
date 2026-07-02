import mongoose from "mongoose";

/**
 * Connect to MongoDB using MONGO_URI from environment.
 * Falls back to a local database URI if not provided.
 */
export async function connectDB() {
  const uri =
    process.env.MONGO_URI || "mongodb://localhost:27017/ticket_bari";

  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
