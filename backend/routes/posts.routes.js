import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  activeCheck,
  createPost,
  deletePost,
  delete_comment_of_user,
  get_comments_by_post,
  increment_likes,
  getAllPosts
} from '../controllers/posts.controller.js';
import { commentPost } from '../controllers/user.controller.js';

const router = Router();

// ✅ Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists at root
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });

// ✅ Routes
router.route('/').get(activeCheck);

// ✅ FIXED: match frontend's `formData.append('file', file)`
router.route('/post').post(upload.single('file'), createPost);

router.route('/posts').get(getAllPosts);
router.route('/delete_post').delete(deletePost);
router.route('/comment').post(commentPost);
router.route('/get_comments').get(get_comments_by_post);
router.route('/delete_comment').delete(delete_comment_of_user);
router.route('/increment_post_like').post(increment_likes);

export default router;