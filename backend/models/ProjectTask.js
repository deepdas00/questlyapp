import mongoose from "mongoose";

const projectTaskSchema = new mongoose.Schema({
  title: String,
  description: String,

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },

  status: {
    type: String,
    enum: ["Backlog", "Execution", "Done"],
    default: "Backlog"
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectWorkspace"
  },

  assignedTo: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("ProjectTask", projectTaskSchema);