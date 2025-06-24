import express from 'express';
import {
  createComment,
  editComment,
  deleteComment,
  likeOrUnlikeComment,
  getCommentsByPost
} from '../controller/comment.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/:postId', authenticateJWT, createComment);
router.put('/edit/:commentId', authenticateJWT, editComment);
router.delete('/:commentId', authenticateJWT, deleteComment);
router.put('/like/:commentId', authenticateJWT, likeOrUnlikeComment);
router.get('/post/:postId', getCommentsByPost);

export default router;
