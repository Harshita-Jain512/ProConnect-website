import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getAboutUser } from '@/config/redux/action/authAction'
import { getAllPosts } from '@/config/redux/action/postAction'

import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'

import { BASE_URL } from '@/config'
import styles from './index.module.css'

export default function ProfilePage() {

  const dispatch = useDispatch()

  const authState = useSelector((state) => state.auth)
  const postReducer = useSelector((state) => state.postReducer)

  const [userProfile, setUserProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])

  /* ----------------------------------
     FETCH DATA
  -----------------------------------*/
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      dispatch(getAboutUser({ token }))
      dispatch(getAllPosts())
    }
  }, [dispatch])

  /* ----------------------------------
     SET PROFILE + POSTS
  -----------------------------------*/
  useEffect(() => {
    if (authState.user) {
      setUserProfile(authState.user)

      if (postReducer.posts?.length) {
        const filtered = postReducer.posts.filter(
          post => post.userId?.username === authState.user.username
        )
        setUserPosts(filtered)
      }
    }
  }, [authState.user, postReducer.posts])

  /* ----------------------------------
     LOADING STATE
  -----------------------------------*/
  if (!userProfile) {
    return (
      <UserLayout>
        <DashboardLayout>
          <p style={{ padding: "1rem" }}>Loading profile...</p>
        </DashboardLayout>
      </UserLayout>
    )
  }

  /* ----------------------------------
     UI
  -----------------------------------*/
  return (
    <UserLayout>
      <DashboardLayout>

        <div className={styles.container}>

          {/* PROFILE IMAGE */}
          <div className={styles.backDropContainer}>
          {/* <div className={styles.backDrop}>*/}
                <label htmlFor='profilePictureUpload' className={styles.backDrop__overlay}>
                    <p>
                        Edit
                    </p>
                </label>
                <input type="file" id='profilePictureUpload'style={{ display: "none" }} />
            <img
              src={`${BASE_URL}/uploads/${userProfile.profilePicture}`}
              alt="profile"
            />
          </div>

          {/* PROFILE DETAILS */}
          <div className={styles.profileContainer__details}>

            <h2>{userProfile.name}</h2>
            <p >@{userProfile.username}</p>
            <p>{userProfile.bio}</p>

            {/* RECENT ACTIVITY */}
            <div style={{ marginTop: "2rem" }}>
              <h3>Recent Activity</h3>

              {userPosts.length === 0 && (
                <p style={{ color: "grey" }}>No posts yet</p>
              )}

              {userPosts.map((post) => (
                <div key={post._id} className={styles.postCard}>
                  <div className={styles.card}>

                    {post.media && (
                      <img
                        src={`${BASE_URL}/uploads/${post.media}`}
                        alt="post"
                      />
                    )}

                    <p>{post.body}</p>

                  </div>
                </div>
              ))}
            </div>

            {/* WORK HISTORY */}
            <div style={{ marginTop: "2rem" }}>
              <h4>Work History</h4>

              {userProfile.pastWork?.length === 0 && (
                <p style={{ color: "grey" }}>No work history</p>
              )}

              {userProfile.pastWork?.map((work, index) => (
                <div key={index} className={styles.workHistoryCard}>
                  <p style={{ fontWeight: "bold" }}>
                    {work.company} - {work.position}
                  </p>
                  <p>{work.years}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </DashboardLayout>
    </UserLayout>
  )
}
