import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Comment from '../model/comment.model';
import Post from '../model/post.model';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Add 
export const createComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const userId = req.userId;

    const comment = new Comment({ postId, userId, text });
    const saved = await comment.save();
    res.status(201).json(saved);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

// Edit 
export const editComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { commentId } = req.params;
  const { text } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    if (comment.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    comment.text = text;
    const updated = await comment.save();
    res.status(200).json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

// Delete
export const deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    const post = await Post.findById(comment.postId);
    const isPostOwner = post?.userId?.toString() === req.userId;

    if (comment.userId.toString() !== req.userId && !isPostOwner) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

// Like 
export const likeOrUnlikeComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { commentId } = req.params;
  const userId = req.userId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const index = comment.likes.findIndex((id: mongoose.Types.ObjectId) => id.equals(userObjectId));

    if (index === -1) {
      comment.likes.push(userObjectId);
    } else {
      comment.likes.splice(index, 1);
    }

    await comment.save();

    res.status(200).json({
      message: index === -1 ? 'Liked' : 'Unliked',
      likeCount: comment.likes.length
    });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

//get 
export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};
