import express from "express";
import {
  createProject,
  getUserProjects,
  getSingleProject,
  deleteProject
} from "../controllers/projectWorkspace.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getUserProjects);
router.get("/:id", authMiddleware, getSingleProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;