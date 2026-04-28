import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 GET USER PROFILE
router.get("/profile", authMiddleware, getUserProfile);

// 🔥 UPDATE USER (name, email only)
router.put("/update", authMiddleware, updateUserProfile);

export default router;