import User from "../models/User.js";

// 🔥 GET USER PROFILE (NO PASSWORD)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      college,
      branch,
      enrollment,
      portfolio
    } = req.body;

    // 🔒 Duplicate email check
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updateFields = {
      name,
      email,
      college,
      branch,
      enrollment,
      portfolio
    };

    const user = await User.findByIdAndUpdate(
      req.user,
      updateFields,
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};