import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
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

  name: {
    type: String,
    required: true
  },

  code: {
    type: String,
    default: ""
  },

  faculty: {
    type: String,
    default: ""
  },

  attended_count: {
    type: Number,
    default: 0
  },

  conducted_count: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

export default mongoose.model("Subject", subjectSchema);