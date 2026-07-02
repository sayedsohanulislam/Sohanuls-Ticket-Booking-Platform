import mongoose from "mongoose";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

/**
 * Connect to MongoDB using MONGO_URI from environment.
 * Falls back to a local database URI if not provided.
 */
export async function connectDB() {
  const uri =
    process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/ticket_bari";

  try {
    mongoose.set("strictQuery", true);
    console.log("Connecting to URI:", uri);
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    if (uri !== "mongodb://localhost:27017/ticket_bari") {
      console.log("🔄 Retrying with local fallback: mongodb://localhost:27017/ticket_bari");
      try {
        const conn = await mongoose.connect("mongodb://localhost:27017/ticket_bari");
        console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
      } catch (fallbackErr) {
        console.error("❌ Local MongoDB fallback failed:", fallbackErr.message);
        process.exit(1);
      }
    }
    process.exit(1);
  }
}
