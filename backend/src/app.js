import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import characterRoute from "./routes/characterRoute.js";
import noteRoute from "./routes/noteRoute.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// CORS configuration for both development and production
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((allowed) => origin.startsWith(allowed) || allowed.includes(origin.replace(/https?:\/\//, "")))) {
        return callback(null, true);
      }
      // In production on Vercel, allow same-origin requests
      if (process.env.VERCEL) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Connect to database (with caching for serverless)
let isConnected = false;
const ensureDbConnected = async (req, res, next) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  next();
};

app.use(ensureDbConnected);

// public routes
app.use("/api/auth", authRoute);
app.use("/api/characters", characterRoute);

// private routes
app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/notes", noteRoute);

export default app;
