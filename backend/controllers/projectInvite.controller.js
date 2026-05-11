import User from "../models/User.js";
import ProjectInvite from "../models/ProjectInvite.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sendEmail from "../utils/sendEmail.js";

export const sendProjectInvite = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { email, projectId } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const invite = await ProjectInvite.create({
      email,
      project: projectId,
      token
    });

    await sendEmail(email, token);

    res.json({ message: "Invite sent" });

  } catch (err) {
    console.error("INVITE ERROR:", err); // 🔥 VERY IMPORTANT
    res.status(500).json({ message: err.message });
  }
};

export const acceptProjectInvite = async (req, res) => {
  try {
    const invite = await ProjectInvite.findOne({
      token: req.params.token
    });

    if (!invite) {
      return res.status(404).json({ message: "Invalid invite" });
    }

    const project = await ProjectWorkspace.findById(invite.project);

    project.members.push({
      user: req.user._id,
      role: "member"
    });

    await project.save();

    invite.status = "accepted";
    await invite.save();

    res.json({ message: "Joined project successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};