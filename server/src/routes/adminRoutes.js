import express from "express";
import { 
    adminLogin, 
    getAllUsers, 
    getUserDetails, 
    giveTask,
    getPendingUsers,
    updateUserStatus
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // Multer ko import karein

const router = express.Router();

router.post("/adminlogin", adminLogin);

// Protected Admin Routes
router.get("/pending-users", protect, isAdmin, getPendingUsers);
router.put("/users/:userId/status", protect, isAdmin, updateUserStatus);
router.get("/allUsers", protect, isAdmin, getAllUsers);
router.get("/user/:id", protect, isAdmin, getUserDetails);

// --- IS ROUTE KO UPDATE KAREIN ---
router.post(
  "/assignTask",
  protect,
  isAdmin,
  upload.single("attachment"), // 'attachment' field se file lega
  giveTask
);

export default router;