import express from "express";
import {
  connectDrive,
  driveCallback,
  uploadFile,
  getFiles
} from "../controllers/driveController.js";

import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/connect", authMiddleware, connectDrive);
router.get("/callback", authMiddleware, driveCallback);
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.get("/files", authMiddleware, getFiles);


export default router;