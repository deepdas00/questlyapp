import nodemailer from "nodemailer";

export const sendEmail = async (to, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const link = `http://localhost:5173/accept-invite/${token}`;

  await transporter.sendMail({
    from: `"Questly" <${process.env.EMAIL_USER}>`,
    to,
    subject: "You're invited to a project 🚀",
    html: `
      <h2>You've been invited!</h2>
      <p>Click below to join the project:</p>
      <a href="${link}">Join Project</a>
    `
  });
};