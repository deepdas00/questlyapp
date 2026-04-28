import express from "express";
import {
  addSubject,
  getSubjects,
  updateSubject, 
  deleteSubject
} from "../controllers/subjectController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addSubject);
router.get("/", authMiddleware, getSubjects);
router.put("/:id", authMiddleware, updateSubject);
router.delete("/:id", authMiddleware, deleteSubject);

export default router;