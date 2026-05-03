import express from "express";
import {
  sendProjectInvite,
  acceptProjectInvite
} from "../controllers/projectInvite.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, sendProjectInvite);
router.get("/accept/:token", authMiddleware, acceptProjectInvite);

export default router;