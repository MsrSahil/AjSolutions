import express from "express";
import {
  Register,
  Login,
  SendOTPForRegister,
  SendOTPForLogin,
  Logout,
  getTasks,
  submitTask,
} from "../controllers/authController.js";
// Puraana 'Protect' hatakar naya 'protect' middleware import karein
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/sendOtpRegister", SendOTPForRegister);
router.post("/sendOtpLogin", SendOTPForLogin);

// Protected User Routes
router.post("/logout", protect, Logout);
router.post("/taskSubmit", protect, submitTask);
router.get("/getTasks", protect, getTasks);

export default router;