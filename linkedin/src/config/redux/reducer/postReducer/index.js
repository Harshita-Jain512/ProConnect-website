import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts, deletePost, getAllComments } from "../../action/postAction"; // ✅ Make sure deletePost is imported
import { loginUser, registerUser } from "../../action/authAction"; // (If still used for other logic)

// ✅ Initial state
const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
};

// ✅ Slice definition
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔁 Get All Posts
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching all the posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.posts.reverse();
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.comments = action.payload.comments;
        state.postId = action.payload.post_id;
        state.comments = action.payload.comments;
      })

      // 🗑️ Delete Post
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message;

        // Filter out the deleted post using post ID from action.meta.arg
        state.posts = state.posts.filter(post => post._id !== action.meta.arg);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
      
  }
});

// ✅ Export reducer
export default postSlice.reducer;

// ✅ Optionally export actions
export const { reset, resetPostId } = postSlice.actions;
