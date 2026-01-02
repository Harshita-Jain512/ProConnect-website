import React from 'react';
import styles from "./styles.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer'; // ✅ Don't forget to import

function NavBarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  console.log("🔍 AuthState:", authState);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reset());
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          Pro Connect
        </h1>

        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched ? (
            <div style={{ display: "flex", gap: "1.2rem" }}>
              {/*<p>
                Hey, {authState.user?.userId?.name || authState.user?.name || "Guest"}
              </p>*/}

              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => router.push("/profile")}
              >
                Profile
              </p>

              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={handleLogout}
              >
                Logout
              </p>
            </div>
          ) : (
            <div
              onClick={() => router.push("/login")}
              className={styles.buttonJoin}
              style={{ cursor: "pointer" }}
            >
              <p>Be a part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavBarComponent;
