import express from "express";
import { 
  addRoutine, 
  getTodayRoutine,
  getAllRoutine,
  deleteRoutine
} from "../controllers/routineController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addRoutine);
router.get("/today", authMiddleware, getTodayRoutine);
router.get("/", authMiddleware, getAllRoutine);
router.delete("/:id", authMiddleware, deleteRoutine);

export default router;