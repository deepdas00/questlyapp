import express from "express";
import {
  createTask,
  getTasks,
  getSingleTask,
  toggleTask,
  updateTaskStatus,
  updateProgress,
  deleteTask,
  getTaskStats
} from "../controllers/taskController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   📌 CREATE
================================ */
router.post("/", authMiddleware, createTask);

/* ===============================
   📊 STATS (put BEFORE /:id)
================================ */
router.get("/stats/summary", authMiddleware, getTaskStats);

/* ===============================
   📌 GET ALL
================================ */
router.get("/", authMiddleware, getTasks);

/* ===============================
   📌 TOGGLE
================================ */
router.put("/toggle/:id", authMiddleware, toggleTask);

/* ===============================
   📌 UPDATE STATUS
================================ */
router.put("/status/:id", authMiddleware, updateTaskStatus);

/* ===============================
   📌 UPDATE PROGRESS
================================ */
router.put("/progress/:id", authMiddleware, updateProgress);

/* ===============================
   📌 DELETE
================================ */
router.delete("/:id", authMiddleware, deleteTask);

/* ===============================
   📌 GET SINGLE (LAST)
================================ */
router.get("/:id", authMiddleware, getSingleTask);

export default router;