import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


import subjectRoutes from "./routes/subjectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import routineRoutes from "./routes/routineRoutes.js";
import semesterRoutes from "./routes/semesterRoutes.js";
import userRoutes from "./routes/userRoutes.js";



dotenv.config();

const app = express();

app.use(cookieParser());


const allowedOrigins = process.env.CLIENT_URLS.split(",");


// IMPORTANT for frontend connection
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/auth", authRoutes);

app.use("/api/attendance", attendanceRoutes);
app.use("/api/routine", routineRoutes);
app.use("/api/semester", semesterRoutes);
app.use("/api/user", userRoutes);
app.use("/api/subject", subjectRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, "0.0.0.0",() => console.log("Server running on port " + process.env.PORT));
  })
  .catch(err => console.log(err));