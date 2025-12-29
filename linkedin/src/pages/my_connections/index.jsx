 import React, { useEffect } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import { useDispatch, useSelector } from "react-redux";
import { AcceptConnection, getMyConnectionRequests } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import styles from './index.module.css';
import { useRouter } from 'next/router';


export default function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getMyConnectionRequests({token: localStorage.getItem("token")}));
  }, [])

  const router = useRouter();

  useEffect(() => {
    if(authState.connectionRequest.length != 0){ 
      console.log(authState.connectionRequest);
    }
  }, [authState.connectionRequest]);
  return (
    <UserLayout>
          <DashboardLayout>
            <div>
              <h4>My Connections</h4>
              
                    {authState.connectionRequest.length === 0 && <h1>No connection requests Pending</h1>}

              {authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user, index) => {
return (
  <div onClick={() => {
    router.push(`/view_profile/${user.userId.username}`);
  }} className={styles.userCard} key={index}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', justifyContent: 'space-between' }}>
<img
        src={`${BASE_URL}/uploads/${user.userId?.profilePicture || "default.jpg"}`}
        alt=""
        onError={(e) => {
          e.target.src = `${BASE_URL}/uploads/default.jpg`;
        }}
      />
    </div>
  <div className={styles.userInfo}>
    <h3>{user.userId.name}</h3>
    <p>@{user.userId?.username}</p>
    </div>
     <button onClick={(e) => {
      e.stopPropagation();

      dispatch(AcceptConnection({
        connectionId: user._id,
        token: localStorage.getItem("token"),
        action: "accept"
      }))
     }}className={styles.connectedButton}>Accept</button>
    
  </div>

                )
              })}
              <div style={{display: "flex", flexDirection: "column", gap: "1.7rem"}}></div>
              <h4>My Network</h4>
             
           {authState.connectionRequest.filter((connection) => connection.status_accepted !== null).map((user, index) => {
          return(
          <div onClick={() => {
    router.push(`/view_profile/${user.userId.username}`);
  }} className={styles.userCard} key={index}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', justifyContent: 'space-between' }}>
<img
        src={`${BASE_URL}/uploads/${user.userId?.profilePicture || "default.jpg"}`}
        alt=""
        onError={(e) => {
          e.target.src = `${BASE_URL}/uploads/default.jpg`;
        }}
      />
    </div>
  <div className={styles.userInfo}>
    <h3>{user.userId.name}</h3>
    <p>@{user.userId?.username}</p>
    </div>
     
    
  </div>
          )
           })}
            </div>
          </DashboardLayout>
        </UserLayout>
  )
}