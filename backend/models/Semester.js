import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 🔥 SHORT LABEL (optional code)
  label: {
    type: String, // e.g. "Sem 4"
    default: ""
  },


  // 🔥 TARGET ATTENDANCE
  target_percentage: {
    type: Number,
    default: 75
  },

  // 🔥 DATE RANGE (VERY IMPORTANT)
  start_date: {
    type: Date,
    default: null
  },

  end_date: {
    type: Date,
    default: null
  },


  // 🔥 STATUS
  is_active: {
    type: Boolean,
    default: true
  },

  is_archived: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Semester", semesterSchema);