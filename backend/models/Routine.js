import mongoose from "mongoose";

const routineSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    semester_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },

    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    // 🔥 DAY (MON–SUN)
    day_of_week: {
      type: String,
      enum: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      required: true,
    },

    // 🔥 TIME SLOT
    start_time: {
      type: String, // "09:00"
      default: null,
    },

    end_time: {
      type: String, // "10:00"
      default: null,
    },

    faculty: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Routine", routineSchema);
