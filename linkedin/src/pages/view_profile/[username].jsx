import { BASE_URL, clientServer } from '@/config';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import styles from './index.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import  getAllPosts from '@/config/redux/action/postAction';
import { getMyConnectionRequests, sendConnectionRequest } from '@/config/redux/action/authAction';
import { getConnectionsRequest } from '@/config/redux/action/authAction';

export default function ViewProfilePage({ userProfile }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.postReducer);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  
    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getMyConnectionRequests({ token }));
    }
  }, [dispatch]);

  // 🔥 ADD THIS useEffect HERE
  // 1️⃣ Fetch connections
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    dispatch(getConnectionsRequest({ token }));
  }
}, [dispatch]);

// 2️⃣ Filter posts
useEffect(() => {
  const post = postReducer.posts.filter(
    post => post.userId.username === router.query.username
  );
  setUserPosts(post);
}, [postReducer.posts, router.query.username]);

// 3️⃣ Connection status (FIXED)
// 4️⃣ DETERMINE CONNECTION STATUS (FINAL & FIXED)
  useEffect(() => {
    if (!userProfile?.userId?._id) return;

    const acceptedConnection = authState.connections?.find(
      c => c.connectionId?._id === userProfile.userId._id
    );

    const pendingRequest = authState.connectionRequest?.find(
      r => r.userId?._id === userProfile.userId._id
    );

    if (acceptedConnection || pendingRequest) {
      setIsCurrentUserInConnection(true);
      setIsConnectionNull(
        !(
          acceptedConnection?.status_accepted === true ||
          pendingRequest?.status_accepted === true
        )
      );
    } else {
      setIsCurrentUserInConnection(false);
      setIsConnectionNull(true);
    }
  }, [
    authState.connections,
    authState.connectionRequest,
    userProfile.userId._id
  ]);


  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img 
              className={styles.backDrop} 
              src={`${BASE_URL}/uploads/${userProfile.userId.profilePicture}`} 
              alt='backdrop'
            />
          </div>

          <div className={styles.profileContainer__details}>
            <div style ={{display: "flex", gap: "0.7rem"}}>
              <div style={{flex: "0.8"}}></div>
              <div style={{display: "flex", width: "fit-content", alignItems: "center"}}></div>
              <h2>{userProfile.userId.name}</h2>
              <p style={{color: "grey"}}>@{userProfile.userId.username}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>

                {isCurrentUserInConnection ? (
  <button className={styles.connectedButton}>
    {isConnectionNull ? "Pending" : "Connected"}
  </button>
) : (
  <button
    className={styles.connectBtn}
    onClick={() => {
      
      dispatch(
        sendConnectionRequest({
          token: localStorage.getItem("token"),
          user_id: userProfile.userId._id,
          
        })
      );
      
    }}
  >
    Connect
  </button>
)}
<div onClick={async() =>{
const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
window.open(`${BASE_URL}/${response.data.message}`, "_blank")
}} style={{cursor: "pointer"}}>
  <svg style={{width:"1.2em"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z"/></svg>
</div>
</div>
<div>
<p>{userProfile.bio}</p>
</div>

<div style={{flex: "0.2"}}>
  <h3>Recent Activity</h3>
  {userPosts.map((post) => {
    return (
    <div key={post._id} className={styles.postCard}>
      <div className={styles.card}>
        <div className={styles.card__profileContainer}>
          {post.media!=="" ?
            <img
              src={`${BASE_URL}/uploads/${post.media}`}
              alt="post"
            />: <div style={{ width: "3.4rem", height: "3.4rem" }}></div>}

                    {/*</div>setIsCurrentUserInConnection(true);
                    </div>setIsConnectionNull(true);*/}
                    
              </div>
              <p>{post.body}</p>
            {/* Profile Header */}
            {/*<div className={styles.profileHeader}>*/}

              
                
                
    

    
            </div>
            </div>
                    )
                  })}
                  </div>
                  </div>
                  <div className= "workHistory">
                    <h4>Work History</h4>
                    <div className={styles.workHistoryContainer}>
                      {userProfile.pastWork.map((work, index) => {
                        return (
                          <div key={index} className={styles.workHistoryCard}>
                            <p style={{fontWeight: "bold", display: "flex",alignItems:"center", gap: "0.8rem"}}>{work.company} - {work.position}</p>

                            <p>{work.years}</p>      
                            </div>       
                                       )
                      })
                    }
                    </div>
                  </div>
                  </div>

            
      </DashboardLayout>
    </UserLayout>
  );
}

// Server-side fetching
export async function getServerSideProps(context) {
  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params: { username: context.query.username }
  });

  return { props: { userProfile: request.data.profile } };
}
