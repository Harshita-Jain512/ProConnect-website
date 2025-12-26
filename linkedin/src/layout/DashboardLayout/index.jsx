import React, { useEffect } from 'react';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setTokenIsThere } from "@/config/redux/reducer/authReducer";
import { getAllUsers } from "@/config/redux/action/authAction";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
  console.log("AFTER HYDRATION:", authState);
}, [authState]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      dispatch(setTokenIsThere());
      dispatch(getAllUsers());
    }
  }, []);

  return (
    <div className="container">
      <div className={styles.homeContainer}>
        {/* Sidebar */}
        <div className={styles.homeContainer__leftBar}>
          <div onClick={() => router.push("/dashboard")} className={styles.sideBarOption}>
            <p>Dashboard</p>
          </div>
          <div onClick={() => router.push("/discover")} className={styles.sideBarOption}>
            <p>Discover</p>
          </div>
          <div onClick={() => router.push("/my_connections")} className={styles.sideBarOption}>
            <p>My Connections</p>
          </div>
        </div>

        {/* Feed */}
        <div className={styles.homeContainer__feedContainer}>
  {children}
</div>

        {/* Top Profiles */}
        <div className={styles.homeContainer__extraContainer}>
          <h3>Top Profiles</h3>
          {authState.all_profiles_fetched ? (
            authState.all_users.length > 0 ? (
              authState.all_users.map((profile) => (
                <div key={profile._id} className={styles.profileCard}
                onClick={() => router.push(`/view_profile/${profile.userId.username}`)}
    style={{ cursor: 'pointer' }}>
                  <p>{profile.userId.username}</p>
                </div>
              ))
            ) : (
              <p>No profiles found.</p>
            )
          ) : (
            <p>Loading profiles...</p>
          )}
        </div>
      </div>
    </div>
  );
}
