import cron from "node-cron";
import webpush from "../push.js";
import PushSubscription from "../models/pushSubscription.model.js";
import { quotes } from "../quotes.js";

const sendNotification = async () => {
  try {
    const randomQuote =
      quotes[Math.floor(Math.random() * quotes.length)];

    const users = await PushSubscription.find();

    for (const user of users) {
      await webpush.sendNotification(
        user,
        JSON.stringify({
          title: "QUESTLY 💡",
          body: randomQuote,
        })
      );
    }

    console.log("Notifications sent 🚀");
  } catch (err) {
    console.error("Cron error:", err);
  }
};

// 8 AM
cron.schedule("0 8 * * *", sendNotification);

// 12 PM
cron.schedule("0 12 * * *", sendNotification);

// 6 PM
cron.schedule("0 18 * * *", sendNotification);