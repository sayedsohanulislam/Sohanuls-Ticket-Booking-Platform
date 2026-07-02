import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Verify the `Authorization: Bearer <token>` header and attach
 * the authenticated user to req.user.
 */
export async function protect(req, res, next) {
  try {
    let token;
    const header = req.headers.authorization || "";
    if (header.startsWith("Bearer ")) {
      token = header.slice(7).trim();
    }
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Token user no longer exists" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
}

/**
 * Restrict route to one or more roles. Example:
 *   router.delete("/users/:id", authorize("admin"), handler)
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Role '${req.user.role}' is not allowed` });
    }
    next();
  };
}
