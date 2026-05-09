import cron from "node-cron";
import webpush from "./push.js";
import PushSubscription from "../models/pushSubscription.model.js";
import { quotes } from "./quotes.js";

// 🎯 Utility to pick random quote
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const sendNotification = async (type) => {
  const users = await PushSubscription.find();

  const message = getRandom(quotes[type]);

  let title = "QUESTLY 💡";

  if (type === "morning") title = "🌅 Start Strong";
  if (type === "noon") title = "⚡ Keep Going";
  if (type === "evening") title = "🌙 Reflect & Recharge";

  for (const user of users) {
    await webpush.sendNotification(
      user,
      JSON.stringify({
        title,
        body: message,
      })
    ).catch(() => {});
  }

  console.log(`✅ ${type} notification sent`);
};


cron.schedule("0 8 * * *", () => sendNotification("morning"), {
  timezone: "Asia/Kolkata",
});

// ☀️ Noon (12 PM)
cron.schedule("0 12 * * *", () => sendNotification("noon"), {
  timezone: "Asia/Kolkata",
});
cron.schedule("50 13 * * *", () => sendNotification("noon"), {
  timezone: "Asia/Kolkata",
});
cron.schedule("55 13 * * *", () => sendNotification("noon"), {
  timezone: "Asia/Kolkata",
});
cron.schedule("0 14 * * *", () => sendNotification("noon"), {
  timezone: "Asia/Kolkata",
});

// 🌙 Evening (6 PM)
cron.schedule("0 18 * * *", () => sendNotification("evening"), {
  timezone: "Asia/Kolkata",
});

console.log("⏰ Cron jobs started...");