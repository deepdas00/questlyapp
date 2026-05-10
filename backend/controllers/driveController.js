import { google } from "googleapis";
import oauth2Client from "../config/googleAuth.js";
import GoogleDrive from "../models/GoogleDrive.js";
import jwt from "jsonwebtoken";


console.log("🚀 driveController loaded");




export const connectDrive = (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(401).send("No token provided");
  }

  let user;

  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).send("Invalid token");
  }

  // 🔥 attach user to session-like memory (temporary)
  req.app.locals.oauthUser = user;

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });

  res.json({ url });
};

// 🔁 CALLBACK
export const driveCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const user = req.app.locals.oauthUser;

    if (!user) {
      return res.status(401).send("User lost during OAuth");
    }

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    // 🔥 Create folder
    const folder = await drive.files.create({
      requestBody: {
        name: "Questly Vault",
        mimeType: "application/vnd.google-apps.folder",
      },
    });

    await GoogleDrive.create({
      user_id: user.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
      folder_id: folder.data.id,
    });

    res.redirect(process.env.CLIENT_URLS); // back to frontend
  } catch (err) {
    console.error(err);
    res.status(500).send("Drive connection failed");
  }
};

// 📤 UPLOAD FILE (WITH SUBJECT FOLDER)
export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const { subject } = req.body;

    const userDrive = await GoogleDrive.findOne({
      user_id: req.user.id,
    });

    if (!userDrive)
      return res.status(400).json({ msg: "Drive not connected" });

    // 🔄 Set credentials
    oauth2Client.setCredentials({
      access_token: userDrive.access_token,
      refresh_token: userDrive.refresh_token,
    });

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    // 🔍 Check if subject folder exists
    const folderSearch = await drive.files.list({
      q: `'${userDrive.folder_id}' in parents and name='${subject}' and mimeType='application/vnd.google-apps.folder'`,
    });

    let subjectFolderId;

    if (folderSearch.data.files.length === 0) {
      // 📁 Create subject folder
      const folder = await drive.files.create({
        requestBody: {
          name: subject,
          mimeType: "application/vnd.google-apps.folder",
          parents: [userDrive.folder_id],
        },
      });

      subjectFolderId = folder.data.id;
    } else {
      subjectFolderId = folderSearch.data.files[0].id;
    }

    // 📤 Upload file
    await drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [subjectFolderId],
      },
      media: {
        mimeType: file.mimetype,
        body: Buffer.from(file.buffer),
      },
    });

    res.json({ msg: "Uploaded successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Upload failed" });
  }
};



export const getFiles = async (req, res) => {
  try {
    const userDrive = await GoogleDrive.findOne({
      user_id: req.user.id,
    });

    if (!userDrive)
      return res.json({ files: [] });

    oauth2Client.setCredentials({
      access_token: userDrive.access_token,
      refresh_token: userDrive.refresh_token,
    });

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    const files = await drive.files.list({
      q: `'${userDrive.folder_id}' in parents`,
      fields: "files(id,name,mimeType,webViewLink)",
    });

    res.json({ files: files.data.files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch files" });
  }
};