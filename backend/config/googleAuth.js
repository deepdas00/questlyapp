import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// 🔥 Decide redirect from ENV
const redirectUri =
  process.env.NODE_ENV === "production"
    ? process.env.GOOGLE_REDIRECT_URI_PROD
    : process.env.GOOGLE_REDIRECT_URI_DEV;

// ❌ safety check
if (!redirectUri) {
  throw new Error("Redirect URI not defined in .env");
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUri
);

export default oauth2Client;