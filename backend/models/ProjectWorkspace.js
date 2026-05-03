import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,

  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["admin", "member"], default: "member" }
    }
  ]
}, { timestamps: true });

export default mongoose.model("ProjectWorkspace", projectSchema);