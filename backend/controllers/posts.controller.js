import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comments.model.js";
// ❌ Do NOT import jwt if you're not using JWT
// import jwt from 'jsonwebtoken';

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};

export const createPost = async (req, res) => {
  console.log("📥 Incoming request to createPost");
  console.log("req.body.body:", req.body.body);
  console.log("req.body.token:", req.body.token);
  console.log("req.file:", req.file);

  const { token, body } = req.body;

  try {
    // ✅ Use your own token logic
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: body,
      media: req.file ? req.file.filename : "",
      filetypes: req.file ? req.file.mimetype.split("/")[1] : ""
    });

    await post.save();

    console.log("✅ Post created:", post);

    return res.status(200).json({ message: "Post Created", post });

  } catch (error) {
    console.error("❌ Post Creation Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'name username email profilePicture');
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(post_id);

    return res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.query;

  try {
    const post = await Post.findOne({_id: post_id});
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
     const comments = await Comment
     .find({postId: post_id})
     .populate("userId", "username name");
    return res.status(200).json( comments.reverse() );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const delete_comment_of_user = async (req, res) => {
  const { token, comment_id } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(comment_id);
    return res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const increment_likes = async (req, res) => {
  const { post_id } = req.body;

  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likes += 1;
    await post.save();

    return res.status(200).json({ message: "Likes incremented" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
