// models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // 📅 Core Timing
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    isAllDay: {
      type: Boolean,
      default: true,
    },

    // ⏰ Time (if not all-day)
    startTime: String, // "14:00"
    endTime: String,

    // 🧠 Categorization
    type: {
      type: String,
      enum: ["college", "personal", "exam", "deadline", "meeting"],
      default: "personal",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    color: {
      type: String,
      default: "#3B82F6", // Tailwind blue
    },

    // 🔔 Reminder system
    reminder: {
      type: Number, // minutes before (e.g. 30)
      default: null,
    },

    // 🔁 Recurring (basic)
    recurrence: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },

    // 📍 Optional
    location: {
      type: String,
      trim: true,
    },

    // 📎 Future use
    isCompleted: {
      type: Boolean,
      default: false,
    },

    // 🗑️ Soft delete (VERY IMPORTANT)
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ⚡ Index for fast calendar queries
eventSchema.index({ userId: 1, startDate: 1 });

export default mongoose.model("Event", eventSchema);