import express from "express";
import {
  register,
  login,
  checkAuth,
  logout,
  sendOtp,
  verifyOtp,
  resetPassword
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check", authMiddleware, checkAuth);
router.post("/logout", logout);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
