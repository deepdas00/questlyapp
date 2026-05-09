import express from "express";
import PushSubscription from "../models/pushSubscription.model.js";

const router = express.Router();



router.get("/test", async (req, res) => {
  try {
    const users = await PushSubscription.find();

    console.log("Users:", users.length);

    for (const user of users) {
      await webpush.sendNotification(
        user,
        JSON.stringify({
          title: "TEST 🔔",
          body: "If you see this → working",
        })
      );
    }

    res.send("Test notification sent");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});




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