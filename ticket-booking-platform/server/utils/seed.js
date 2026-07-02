/**
 * Seed script — creates an admin user, a demo vendor, a demo user,
 * and a few sample tickets + bookings so the app has data on first run.
 *
 * Usage:
 *   npm run seed
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import Booking from "../models/Booking.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/ticket_bari";

async function run() {
  await mongoose.connect(MONGO_URI);
  mongoose.set("strictQuery", true);
  console.log("🌱 Seeding database…");

  // Wipe collections (comment out to preserve data)
  await Promise.all([
    User.deleteMany({}),
    Ticket.deleteMany({}),
    Booking.deleteMany({}),
  ]);

  const admin = await User.create({
    name: "Admin",
    email: "admin@ticketbari.test",
    password: "Admin123!",
    role: "admin",
  });

  const vendor = await User.create({
    name: "Demo Vendor",
    email: "vendor@ticketbari.test",
    password: "Vendor123!",
    role: "vendor",
  });

  const user = await User.create({
    name: "Demo User",
    email: "user@ticketbari.test",
    password: "User123!",
    role: "user",
  });

  const tickets = await Ticket.insertMany([
    {
      title: "Dhaka → Chittagong AC Bus",
      from: "Dhaka",
      to: "Chittagong",
      transportType: "bus",
      price: 1200,
      quantity: 30,
      departureDate: new Date(Date.now() + 86400000 * 2),
      perks: ["AC", "WiFi", "Snacks"],
      image: "",
      vendor: vendor._id,
      vendorName: vendor.name,
      vendorEmail: vendor.email,
      verificationStatus: "approved",
      isAdvertised: true,
    },
    {
      title: "Dhaka → Sylhet Train",
      from: "Dhaka",
      to: "Sylhet",
      transportType: "train",
      price: 800,
      quantity: 50,
      departureDate: new Date(Date.now() + 86400000 * 3),
      perks: ["AC"],
      image: "",
      vendor: vendor._id,
      vendorName: vendor.name,
      vendorEmail: vendor.email,
      verificationStatus: "approved",
      isAdvertised: true,
    },
    {
      title: "Barishal → Dhaka Launch",
      from: "Barishal",
      to: "Dhaka",
      transportType: "launch",
      price: 1500,
      quantity: 20,
      departureDate: new Date(Date.now() + 86400000 * 4),
      perks: ["Cabin", "AC", "Breakfast"],
      image: "",
      vendor: vendor._id,
      vendorName: vendor.name,
      vendorEmail: vendor.email,
      verificationStatus: "approved",
    },
  ]);

  await Booking.create({
    ticket: tickets[0]._id,
    user: user._id,
    vendor: vendor._id,
    quantity: 2,
    unitPrice: 1200,
    totalPrice: 2400,
    status: "pending",
  });

  console.log("✅ Seed complete:");
  console.log("   Admin   : admin@ticketbari.test / Admin123!");
  console.log("   Vendor  : vendor@ticketbari.test / Vendor123!");
  console.log("   User    : user@ticketbari.test / User123!");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
