import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const redirectUri = process.env.GOOGLE_REDIRECT_URI;

console.log("🔥 Redirect URI:", redirectUri); // DEBUG

// 🔴 DEBUG (keep temporarily)
console.log("Redirect URI:", redirectUri);

if (!redirectUri) {
  throw new Error("Redirect URI not defined in .env");
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUri
);

export default oauth2Client;