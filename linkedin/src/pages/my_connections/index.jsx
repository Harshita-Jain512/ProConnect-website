 import React, { useEffect } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import { useDispatch, useSelector } from "react-redux";
import { getMyConnectionRequests } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import styles from './index.module.css';


export default function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getMyConnectionRequests({token: localStorage.getItem("token")}));
  }, [])

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

              {authState.connectionRequest.length != 0 && authState.connectionRequest.map((user, index) => {
return (
  <div className={styles.userCard} key={index}>
  <div className={styles.userInfoRow}>
    
    <div className={styles.profilePicture}>
      <img
        src={`${BASE_URL}/uploads/${user.userId?.profilePicture || "default.jpg"}`}
        alt=""
        onError={(e) => {
          e.target.src = `${BASE_URL}/uploads/default.jpg`;
        }}
      />
    </div>

    <div className={styles.userDetails}>
      <h3>{user.userId?.name}</h3>
      <p>@{user.userId?.username}</p>
    </div>

  </div>
</div>

                )
              })}
            </div>
          </DashboardLayout>
        </UserLayout>
  )
}