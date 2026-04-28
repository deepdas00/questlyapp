import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  semester_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  // 🔥 DAY TYPE
  day_type: {
    type: String,
    enum: ["NORMAL", "HOLIDAY", "MASS_BUNK"],
    default: "NORMAL"
  },

  // 🔥 SLOT BASED (VERY IMPORTANT)
  slots: [
    {
      routine_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Routine",
        required: true
      },

      subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
      },

      status: {
        type: String,
        enum: ["PRESENT", "ABSENT"],
        required: true
      }
    }
  ]

}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);