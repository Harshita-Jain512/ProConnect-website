import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import {
  createPost,
  deletePost,
  getAllComments,
  postComment,
  getAllPosts,
  incrementPostLike
} from "@/config/redux/action/postAction";

import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { resetPostId } from "@/config/redux/reducer/postReducer";

const BASE_URL = "https://proconnect-website.onrender.com";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);

  

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(getAllPosts());
    dispatch(getAboutUser({ token }));

    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [dispatch, router, authState.all_profiles_fetched]);

  if (!authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <h2>Loading...</h2>
        </DashboardLayout>
      </UserLayout>
    );
  }

  const myProfilePic =
    authState.user?.profilePicture || "default.jpg";

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.wrapper}>

            {/* ================= CREATE POST ================= */}
            <div className={styles.createPostContainer}>
              <img
                className={styles.userProfile}
                src={`${BASE_URL}/uploads/${myProfilePic}`}
                alt="profile"
                onError={(e) => {
                  e.target.src = `${BASE_URL}/uploads/default.jpg`;
                }}
              />

              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's in your mind?"
                className={styles.textAreaOfContent}
              />

              <label htmlFor="fileUpload">
                <div className={styles.Fab}>+</div>
              </label>

              <input
                type="file"
                hidden
                id="fileUpload"
                onChange={(e) => setFileContent(e.target.files[0])}
              />

              {(postContent || fileContent) && (
                <div
                  onClick={async () => {
                    await dispatch(
                      createPost({ file: fileContent, body: postContent })
                    );
                    setPostContent("");
                    setFileContent(null);
                    dispatch(getAllPosts());
                  }}
                  className={styles.uploadButton}
                >
                  Post
                </div>
              )}
            </div>

            {/* ================= POSTS ================= */}
            <div className={styles.postsContainer}>
              {(postState.posts || []).map((post) => (
                <div key={post._id} className={styles.singleCard}>
                  <div className={styles.singleCard_profileContainer}>
                    <img
                      className={styles.userProfile}
                      src={`${BASE_URL}/uploads/${post.userId?.profilePicture || "default.jpg"}`}
                      alt="profile"
                      onError={(e) => {
                        e.target.src = `${BASE_URL}/uploads/default.jpg`;
                      }}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        router.push(`/view_profile/${post.userId?.username}`)
                      }
                    />

                    <div className={styles.profileTextContainer}>
                      <div className={styles.nameAndTrash}>
                        <p
                          style={{ fontWeight: "bold", cursor: "pointer" }}
                          onClick={() =>
                            router.push(`/view_profile/${post.userId?.username}`)
                          }
                        >
                          {post.userId?.name}
                        </p>

                        {post.userId?._id === authState.user?.userId?._id && (

                          <div
                            className={styles.trashIcon}
                            onClick={async () => {
                              await dispatch(deletePost(post._id));
                              dispatch(getAllPosts());
                            }}
                          >
                            🗑
                          </div>
                        )}
                      </div>

                      <p
                        style={{ color: "grey", cursor: "pointer" }}
                        onClick={() =>
                          router.push(`/view_profile/${post.userId?.username}`)
                        }
                      >
                        @{post.userId?.username}
                      </p>

                      <p style={{ paddingTop: "1.3rem" }}>{post.body}</p>

                      {post.media && (
                        <div className={styles.singleCard__image}>
                          <img
                            src={`${BASE_URL}/uploads/${post.media}`}
                            alt="post"
                          />
                        </div>
                      )}

                      {/* ================= OPTIONS ================= */}
                      <div className={styles.optionsContainer}>

                        {/* LIKE */}
                        <div
                          className={styles.singleOption__optionsContainer}
                          onClick={async () => {
                            await dispatch(
                              incrementPostLike({ post_id: post._id })
                            );
                            dispatch(getAllPosts());
                          }}
                        >
                          👍 {post.likes || 0}
                        </div>

                        {/* COMMENT */}
                        <div
                          className={styles.singleOption__optionsContainer}
                          onClick={() =>
                            dispatch(getAllComments({ post_id: post._id }))
                          }
                        >
                          💬
                        </div>
                        {/* SHARE */}
                        <div onClick={() =>{
                          const text = encodeURIComponent(post.body)
                          const url = encodeURIComponent("harshita.in");
                          const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                          window.open(twitterUrl, '_blank');
                        }}
                          className={styles.singleOption__optionsContainer}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M371.8 82.4C359.8 87.4 352 99 352 112L352 192L240 192C142.8 192 64 270.8 64 368C64 481.3 145.5 531.9 164.2 542.1C166.7 543.5 169.5 544 172.3 544C183.2 544 192 535.1 192 524.3C192 516.8 187.7 509.9 182.2 504.8C172.8 496 160 478.4 160 448.1C160 395.1 203 352.1 256 352.1L352 352.1L352 432.1C352 445 359.8 456.7 371.8 461.7C383.8 466.7 397.5 463.9 406.7 454.8L566.7 294.8C579.2 282.3 579.2 262 566.7 249.5L406.7 89.5C397.5 80.3 383.8 77.6 371.8 82.6z"/></svg>
                        </div>
                        <div
                          className={styles.singleOption__optionsContainer}
                          onClick={() =>
                            dispatch(getAllComments({ post_id: post._id }))
                          }
                        >
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= COMMENTS MODAL ================= */}
        {postState.postId!=="" && 
        <div 
        onClick={() =>{
          dispatch(resetPostId());
        }}className={styles.commentsContainer}> 
          <div
          onClick={(e) => {
            e.stopPropagation()
          }}
        className={styles.allCommentsContainer}>
          {postState.comments.length === 0 && <h2>No comments yet</h2>}
          {postState.comments.length !== 0 && <div> 
            {postState.comments.map((comment, index) => {
              return(<div className={styles.singleComment} key={comment._id}>
                <div className={styles.singleComment__profileContainer}>
                  <img src={`${BASE_URL}/${comment.userId.profilePicture}`} alt=""/>
                  <div>
                    <p style={{fontWeight: "bold" , fontSize: "1.2rem"}}>{comment.userId.name}</p>
                    <p>{comment.userId.username}</p>
                  </div>
                  </div>
                  <p>
                  {comment.body}
                  </p>
                  </div>
              )
            })}
            </div>}
           <div className={styles.postCommentContainer}>
            <input type="" value={commentText} onChange ={(e) => setCommentText(e.target.value)} placeholder="Comment"/>
              <div onClick={async ()=> {
                await dispatch(postComment({
                  post_id: postState.postId,
                  body: commentText
             }))
              await dispatch(getAllComments({post_id: postState.postId}))
            }}
              className={styles.postCommentContainer__commentBtn}>
                 <p>Comment</p>
              </div>
           </div>
          </div>
          </div>
  
        
          }
      </DashboardLayout>
    </UserLayout>
  );
}
