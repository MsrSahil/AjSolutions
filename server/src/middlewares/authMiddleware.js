import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// User ko authenticate karne ke liye
export const protect = async (req, res, next) => {
  let token;
  token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Check karne ke liye ki user Admin hai ya nahi
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};