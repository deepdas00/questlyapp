import express from "express";
import PushSubscription from "../models/pushSubscription.model.js";

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  try {
    const sub = req.body;

    await PushSubscription.findOneAndUpdate(
      { endpoint: sub.endpoint },
      sub,
      { upsert: true }
    );

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save subscription" });
  }
});

export default router;