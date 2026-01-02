 import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getAboutUser } from '@/config/redux/action/authAction'
import { getAllPosts } from '@/config/redux/action/postAction'

import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'

import { BASE_URL, clientServer } from '@/config'
import styles from './index.module.css'

export default function ProfilePage() {

  

  const authState = useSelector((state) => state.auth)
  const postReducer = useSelector((state) => state.postReducer)

  const [userProfile, setUserProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])

  const dispatch = useDispatch();

  const [ isModalOpen, setIsModalOpen] = useState(false);

  const[inputData, setInputData] = useState({company: " ", position: "", years: ""});
  
  const handleWorkInputChange = (e) => {
     const {name, value} =e.target;
     setInputData({...inputData, [name]: value});
  }
  

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

  const updateProfileData = async () => {
  await clientServer.post("/user_update", {
    token: localStorage.getItem("token"),
    name: userProfile.userId.name
  });

  await clientServer.post("/update_profile_data", {
    token: localStorage.getItem("token"),
    bio: userProfile.bio,
    currentPost: userProfile.currentPost,
    pastWork: userProfile.pastWork,
    education: userProfile.education
  });

  dispatch(getAboutUser({ token: localStorage.getItem("token") }));
};


  /* ----------------------------------
     SET PROFILE + POSTS
  -----------------------------------*/
  useEffect(() => {
    if (authState.user) {
      setUserProfile(authState.user)

      if (postReducer.posts?.length) {
        const filtered = postReducer.posts.filter(
          post => post.userId?._id === authState.user.userId._id

        )
        setUserPosts(filtered)
      }
    }
  }, [authState.user, postReducer.posts])

  
const updateProfilePicture = async(file ) => {
  const formData = new FormData();
  formData.append("profile_picture", file);
  formData.append("token", localStorage.getItem("token"));

  const response = await clientServer.post("/update_profile_picture", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  dispatch(getAboutUser({ token: localStorage.getItem("token")}));
}

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
                <input onChange={(e) => {
                  updateProfilePicture(e.target.files[0]);
                }} hidden type="file" id='profilePictureUpload' />
            <img
              src={`${BASE_URL}/uploads/${userProfile.userId.profilePicture}`}
              alt="profile"
            />
          </div>

          {/* PROFILE DETAILS */}
          <div className={styles.profileContainer__details}>

            <div style={{ display: "flex", width:"fit-content", alignItems: "center", gap: "1.2rem"}}>
              <input 
  className={styles.nameEdit}
  type="text"
  value={userProfile?.userId?.name || ""}
  onChange={(e) =>
    setUserProfile(prev => ({
      ...prev,
      userId: {
        ...prev.userId,
        name: e.target.value
      }
    }))
  }
/>
            </div>
            <p >@{userProfile.userId.username}</p>
            <div>
              <textarea
              value={userProfile.bio}
              onChange={(e) => {
                setUserProfile({...userProfile, bio: e.target.value});
              }}
              rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
              style={{ width: "100%"}}
              />
            </div>

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
                <button className={styles.addWorkButton}  onClick={() => {
                  setIsModalOpen(true)
                }}> Add Work </button>
            </div>

          </div>
          {userProfile != authState.user && <div onClick={() => {
            updateProfileData();
          }} className={styles.updateProfileBtn}>
              Update Profile
        </div>
}
</div>

{isModalOpen && 
        <div 
        onClick={() =>{
          setIsModalOpen(false)
        }}className={styles.commentsContainer}> 
          <div
          onClick={(e) => {
            e.stopPropagation()
          }}
        className={styles.allCommentsContainer}>
          <input
                onChange={handleWorkInputChange}
                name='company'
                className={styles.inputField}
                type="text"
                placeholder="Enter Company"
              />

              <input
                onChange={handleWorkInputChange}
                name='position'
                className={styles.inputField}
                type="text"
                placeholder="Enter Position"
              />

              <input
                onChange={handleWorkInputChange}
                name='years'
                className={styles.inputField}
                type="number"
                placeholder=" Years "
              />
              <div onClick={() => {
                setUserProfile({...userProfile, pastWork: [...userProfile.pastWork, inputData]})
                setIsModalOpen(false);
              }} className={styles.updateProfileBtn}>Add work</div>
          
          </div>
          </div>
  
        
          }

      </DashboardLayout>
    </UserLayout>
  )
}
