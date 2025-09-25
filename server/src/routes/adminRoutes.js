// routes/admin.js
import express from "express";
import { adminLogin, getAllUsers, getAllUserTasks, getTaskDetails, getUserDetails, giveTask } from "../controllers/adminController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/adminlogin", adminLogin);
// ✅ Get all tasks (latest → oldest)
router.get("/allTasks", isAuthenticated, getAllUserTasks);

// ✅ Get single task details
router.get("/task/:id", isAuthenticated, getTaskDetails);

// ✅ Get all users (list)
router.get("/allUsers", isAuthenticated, getAllUsers);

// ✅ Get single user details + their tasks
router.get("/user/:id", isAuthenticated, getUserDetails);

// ✅ Assign task to multiple users
router.post("/assignTask", isAuthenticated, giveTask);


export default router;
