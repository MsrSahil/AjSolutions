import { config } from "dotenv";
import path from "path"; // path module ko import karein

// .env file ka path configure karein taaki woh hamesha sahi jagah se load ho
config({ path: path.resolve("./.env") });

import express from "express";
import connectDB from "./src/config/db.js";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Static folder for temporary file uploads
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "backend is running",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    message,
  });
});

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  console.log("server started at", port);
  connectDB();
});