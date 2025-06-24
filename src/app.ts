import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/post.routes";
import authRoutes from "./routes/auth.routes";
import path from "path";
import commentRoutes from './routes/comment.routes';


dotenv.config();

const app = express();
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/comments', commentRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URL as string)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection failed:", err));

export default app;
