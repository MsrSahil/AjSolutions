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
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);

router.post("/sendOtpRegister", SendOTPForRegister);
router.post("/sendOtpLogin", SendOTPForLogin);
router.post("/logout", Protect, Logout);
router.post("/taskSubmit", Protect, submitTask);
router.get("/getTasks", Protect, getTasks);



export default router;
