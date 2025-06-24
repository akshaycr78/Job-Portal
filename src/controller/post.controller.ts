import { Request, Response } from "express";
import Post from "../model/post.model";

interface AuthRequest extends Request {
  userId?: string;
}

// Create Post
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { content, location } = req.body;
  const image = req.file?.filename;

  try {
    const newPost = new Post({
      content,
      location,
      image,
      userId: req.userId,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

// Update Post
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const updated = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

// Delete Post
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await Post.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

// Like or Unlike Post
export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const alreadyLiked = post.likedBy.includes(userId as string);

    const updated = await Post.findByIdAndUpdate(
      id,
      alreadyLiked
        ? { $inc: { likes: -1 }, $pull: { likedBy: userId } }
        : { $inc: { likes: 1 }, $push: { likedBy: userId } },
      { new: true }
    );

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      post: updated,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

// Share Post
export const sharePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const updated = await Post.findByIdAndUpdate(
      id,
      { $inc: { shares: 1 } },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

// Get users who liked the post
export const getLikedUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json({ likedBy: post.likedBy });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};
