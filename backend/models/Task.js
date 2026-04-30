import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  /* 🔥 TYPE OF TASK */
  type: {
    type: String,
    enum: ["DAILY", "ASSIGNMENT"],
    required: true
  },

  /* 📝 COMMON */
  title: {
    type: String,
    required: true
  },

  category: {
    type: String,
    default: "General"
  },

  /* 🏷️ TAGS (for daily tasks) */
  tags: {
    type: [String],
    default: []
  },

  note: {
    type: String,
    default: ""
  },

  /* 📅 DATE */
  due_date: {
    type: Date
  },

  /* 📊 PROGRESS (for assignments) */
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  /* 🔄 STATUS */
  status: {
    type: String,
    enum: ["TODO", "IN_PROGRESS", "DONE", "COMPLETED"],
    default: "TODO"
  },

  /* 🎯 XP SYSTEM */
  points: {
    type: Number,
    default: 50
  },

  /* 🎨 UI SUPPORT */
  color: {
    type: String,
    default: "bg-indigo-500"
  },

  /* ⏱️ TIME LABEL (optional UI) */
  time_label: {
    type: String,
    default: ""
  }

}, { timestamps: true });

export default mongoose.model("Task", taskSchema);