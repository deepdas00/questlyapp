import express from "express";
import {
  createSemester,
  getActiveSemester,
  updateSemester,
  endSemester,
  resetSemesterData
} from "../controllers/semesterController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createSemester);
router.get("/active", authMiddleware, getActiveSemester);
router.put("/update", authMiddleware, updateSemester); // ✅ main update
router.post("/end", authMiddleware, endSemester);
router.post("/reset", authMiddleware, resetSemesterData);

export default router;