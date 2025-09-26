import express from "express";
import {
  adminLogin,
  getAllUsers,
  getUserDetails,
  giveTask,
  getPendingUsers,
  updateUserStatus,
} from "../controllers/adminController.js";
// Naye middleware import karein
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route
router.post("/adminlogin", adminLogin);

// Protected Admin Routes
router.get("/pending-users", protect, isAdmin, getPendingUsers);
router.put("/users/:userId/status", protect, isAdmin, updateUserStatus);
router.get("/allUsers", protect, isAdmin, getAllUsers);
router.get("/user/:id", protect, isAdmin, getUserDetails);
router.post("/assignTask", protect, isAdmin, giveTask);

export default router;
