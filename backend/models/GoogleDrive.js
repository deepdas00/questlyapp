import mongoose from "mongoose";

const googleSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  access_token: String,
  refresh_token: String,
  expiry_date: Number,
  folder_id: String,
});

export default mongoose.model("GoogleDrive", googleSchema);