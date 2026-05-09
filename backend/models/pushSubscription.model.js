import mongoose from "mongoose";

const pushSchema = new mongoose.Schema({
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String,
  },
});

const PushSubscription = mongoose.model(
  "PushSubscription",
  pushSchema
);

export default PushSubscription;