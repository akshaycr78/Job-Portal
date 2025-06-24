import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  likePost,
  sharePost,
  getLikedUsers
} from "../controller/post.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import upload from "../utlis/multerConfig";

const router = express.Router();

// Create a post
router.post("/add", authenticateJWT, upload.single("image"), createPost);

// Edit a post
router.put("/edit/:id", authenticateJWT, updatePost);

// Delete a post
router.delete("/delete/:id", authenticateJWT, deletePost);

// Like or Unlike a post
router.put("/like/:id", authenticateJWT, likePost);

// Share a post
router.put("/share/:id", authenticateJWT, sharePost);

// Get list of users who liked a post
router.get("/liked-users/:id", authenticateJWT, getLikedUsers);

export default router;
