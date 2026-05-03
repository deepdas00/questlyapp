import express from "express";
import {
  createProjectTask,
  getProjectTasks,
  updateProjectTask,
  deleteProjectTask
} from "../controllers/projectTask.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProjectTask);
router.get("/:projectId", authMiddleware, getProjectTasks);
router.put("/:id", authMiddleware, updateProjectTask);
router.delete("/:id", authMiddleware, deleteProjectTask);

export default router;