import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';
import { loginUser, registerUser, getAboutUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false); // false = signup, true = login
  const [email, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  // ✅ After login, fetch user profile and redirect
  useEffect(() => {
    if (authState.loggedIn) {
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(getAboutUser({ token })); // ✅ Fetch user profile
      }
      router.push('/dashboard');
    }
  }, [authState.loggedIn, dispatch, router]);

  // Clean up if token exists but user is not logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !authState.loggedIn) {
      localStorage.removeItem('token');
      dispatch(emptyMessage());
    }
  }, [authState.loggedIn, dispatch]);

  // Reset message on toggle
  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod, dispatch]);

  const handleRegister = () => {
    if (!username || !name || !email || !password) {
      alert('All fields are required');
      return;
    }
    dispatch(registerUser({ username, password, email, name }));
  };

  const handleLogin = () => {
    if (!email || !password) {
      alert('All fields are required');
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  const handleSubmit = () => {
    if (userLoginMethod) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardleft__heading}>
              {userLoginMethod ? 'Sign In' : 'Sign Up'}{' '}
              <span style={{ color: authState.isError ? 'red' : 'green' }}>
                {typeof authState.message === 'string'
                  ? authState.message
                  : authState.message?.message}
              </span>
            </p>

            <div className={styles.inputContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                  />
                </div>
              )}

              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type="text"
                placeholder="Email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="password"
                placeholder="Password"
              />

              <div
                onClick={handleSubmit}
                className={styles.buttonWithOutline}
                style={{ cursor: 'pointer' }}
              >
                <p>{userLoginMethod ? 'Sign In' : 'Sign Up'}</p>
              </div>

              <div
                onClick={() => setUserLoginMethod(!userLoginMethod)}
                style={{ cursor: 'pointer', textAlign: 'center', marginTop: '10px' }}
              >
                <p>
                  {userLoginMethod
                    ? "Don't have an account? Sign Up"
                    : 'Already have an account? Sign In'}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer__right}></div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
