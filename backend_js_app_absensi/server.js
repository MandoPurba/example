import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import multer from "multer";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import cors from "cors";
import sharp from "sharp";
import jwt from "jsonwebtoken";
import "./models/associations.js";
import { randomUUID } from "crypto";

// ROUTES
import userRoutes from "./src/routes/user.route.js";
import faceRecognitionRoutes from "./src/routes/face.recognition.route.js";
import authRoutes from "./src/routes/auth.route.js";
import shiftRoutes from "./src/routes/shift.route.js"
import branchRoutes from "./src/routes/branch.route.js";
import attendanceRoutes from "./src/routes/attendance.route.js";
import fileRoute from "./src/routes/file.route.js"
import DepartmentRoute from "./src/routes/department.route.js"
import AccessRoutingRoute from "./src/routes/access.routing.route.js"
import permissionRoutes from "./src/routes/permission.route.js"
import sequelize from "./src/db/sequelize.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 8001;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8081",
  "https://2661-158-140-164-79.ngrok-free.app",
  "http://192.168.18.234:8081",
  "http://192.168.18.234:3000"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-face-token"],
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log("IP:", req.ip);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to API");
});


app.use("/users", userRoutes);
app.use("/face-recognitions", faceRecognitionRoutes);
app.use("/auth", authRoutes);
app.use("/branches", branchRoutes);
app.use("/attendances", attendanceRoutes);
app.use("/files", fileRoute)
app.use("/shifts", shiftRoutes)
app.use("/departments", DepartmentRoute)
app.use("/access-routes", AccessRoutingRoute)
app.use("/permissions", permissionRoutes)


const startServer = async () => {
  try {

    await sequelize.authenticate();

    console.log(
      "Database connected successfully"
    );

    console.log(
      `Server running on port ${port}`
    );

    app.listen(port, () => {
      console.log(
        `API ready at ${process.env.URL}`
      );
    });

  } catch (error) {

    console.error(
      "Failed to connect to database:",
      error.message
    );

    process.exit(1);
  }
};

startServer();
