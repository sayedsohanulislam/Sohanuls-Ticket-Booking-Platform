import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler, createError } from "../middleware/errorHandler.js";

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function sanitize(user) {
  const obj = user.toJSON();
  obj.token = signToken(user);
  return obj;
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw createError("Name, email and password are required", 400);
  }
  const exists = await User.findOne({ email });
  if (exists) {
    throw createError("Email already registered", 409);
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({ user: sanitize(user) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw createError("Email and password are required", 400);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw createError("Invalid credentials", 401);
  }
  res.json({ user: sanitize(user) });
});

// POST /api/auth/google  — receives a payload from the client (BetterAuth-style)
// In production you would verify the Google ID token server-side.
export const googleLogin = asyncHandler(async (req, res) => {
  const { email, name, providerId, avatar } = req.body;
  if (!email) throw createError("Email is required from Google payload", 400);

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: name || "Google User",
      email,
      password: Math.random().toString(36).slice(2) + "G0!", // random placeholder
      provider: "google",
      providerId,
      avatar,
    });
  }
  res.json({ user: sanitize(user) });
});

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw createError("User not found", 404);
  res.json({ user: sanitize(user) });
});
