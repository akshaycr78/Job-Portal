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

router.post("/add", authenticateJWT, upload.single("image"), createPost);
router.put("/edit/:id", authenticateJWT, updatePost);
router.delete("/delete/:id", authenticateJWT, deletePost);
router.put("/like/:id", authenticateJWT, likePost);
router.put("/share/:id", authenticateJWT, sharePost);
router.get("/liked-users/:id", authenticateJWT, getLikedUsers);

export default router;
