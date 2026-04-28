import express from "express";
import {
  markFullDay,
  markSubjectAttendance,
  getAttendance
} from "../controllers/attendanceController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/mark-day", authMiddleware, markFullDay);
router.post("/mark-subject", authMiddleware, markSubjectAttendance);
router.get("/", authMiddleware, getAttendance);

export default router;