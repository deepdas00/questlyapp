// routes/event.routes.js

import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  toggleComplete,
} from "../controllers/eventController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Create Event
router.post("/", authMiddleware, createEvent);

// 📥 Get All Events (with optional date filter)
router.get("/", authMiddleware, getEvents);

// ✏️ Update Event
router.put("/:id", authMiddleware, updateEvent);

// 🗑️ Soft Delete Event
router.delete("/:id", authMiddleware, deleteEvent);

// ✅ Toggle Complete
router.patch("/:id/toggle", authMiddleware, toggleComplete);

export default router;