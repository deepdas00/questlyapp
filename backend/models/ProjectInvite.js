import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  email: String,

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectWorkspace"
  },

  token: String,

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
});

export default mongoose.model("ProjectInvite", inviteSchema);