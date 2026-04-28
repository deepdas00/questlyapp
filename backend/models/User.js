import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  // 🔥 NEW FIELDS (from your UI)
  college: {
    type: String,
    default: ""
  },

  branch: {
    type: String,
    default: ""
  },

  enrollment: {
    type: String,
    default: ""
  },

  portfolio: {
    type: String,
    default: ""
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);