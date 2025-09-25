import express from "express";
import { 
    adminLogin, 
    getAllUsers, 
    getUserDetails, 
    giveTask,
    getPendingUsers,
    updateUserStatus
    // ❌ getAllUserTasks aur getTaskDetails ko import se HATA DEIN
} from "../controllers/adminController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/adminlogin", adminLogin);

router.get("/pending-users", isAuthenticated, getPendingUsers);
router.put("/users/:userId/status", isAuthenticated, updateUserStatus);


// ❌ /allTasks aur /task/:id wali routes ko YAHAN SE HATA DIYA GAYA HAI


router.get("/allUsers", isAuthenticated, getAllUsers);
router.get("/user/:id", isAuthenticated, getUserDetails);
router.post("/assignTask", isAuthenticated, giveTask);

export default router;