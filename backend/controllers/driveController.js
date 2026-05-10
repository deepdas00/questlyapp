import { google } from "googleapis";
import oauth2Client from "../config/googleAuth.js";
import GoogleDrive from "../models/GoogleDrive.js";

// 🔗 CONNECT GOOGLE
export const connectDrive = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // 🔥 ensures refresh token
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });

  res.redirect(url);
};

// 🔁 CALLBACK
export const driveCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    // 🔥 Check if user already has folder
    let userDrive = await GoogleDrive.findOne({
      user_id: req.user.id,
    });

    let folderId;

    if (!userDrive) {
      // 📁 Create main folder
      const folder = await drive.files.create({
        requestBody: {
          name: "Questly Vault",
          mimeType: "application/vnd.google-apps.folder",
        },
      });

      folderId = folder.data.id;

      // 💾 Save to DB
      await GoogleDrive.create({
        user_id: req.user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
        folder_id: folderId,
      });
    } else {
      // 🔁 Update tokens only
      userDrive.access_token = tokens.access_token;
      userDrive.refresh_token =
        tokens.refresh_token || userDrive.refresh_token;
      userDrive.expiry_date = tokens.expiry_date;
      await userDrive.save();

      folderId = userDrive.folder_id;
    }

    res.send("Drive Connected ✅ You can close this tab");
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