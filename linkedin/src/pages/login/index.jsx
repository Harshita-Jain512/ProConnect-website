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
  const [errors, setErrors] = useState({});

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

  const validateLogin = () => {
  const newErrors = {};

  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = "Enter a valid email";
  }

  if (!password.trim()) {
    newErrors.password = "Password is required";
  } else if (password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const validateRegister = () => {
  const newErrors = {};

  if (!username.trim()) {
    newErrors.username = "Username is required";
  }

  if (!name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = "Enter a valid email";
  }

  if (!password.trim()) {
    newErrors.password = "Password is required";
  } else if (password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleRegister = () => {
  if (!validateRegister()) return;

  dispatch(registerUser({ username, name, email, password }));
};

  const handleLogin = () => {
  if (!validateLogin()) return;

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
  onChange={(e) => {
    setUsername(e.target.value);
    setErrors({ ...errors, username: "" });
  }}
  className={styles.inputField}
  type="text"
  placeholder="Username"
/>

{errors.username && (
  <p style={{ color: "red", fontSize: "12px" }}>
    {errors.username}
  </p>
)}
                  <input
  value={name}
  onChange={(e) => {
    setName(e.target.value);
    setErrors({ ...errors, name: "" });
  }}
  className={styles.inputField}
  type="text"
  placeholder="Name"
/>

{errors.name && (
  <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
    {errors.name}
  </p>
)}
                </div>
              )}

              <input
  value={email}
  onChange={(e) => {
    setEmailAddress(e.target.value);
    setErrors({ ...errors, email: "" });
  }}
  className={styles.inputField}
  type="text"
  placeholder="Email"
/>

{errors.email && (
  <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
    {errors.email}
  </p>
)}
              <input
  value={password}
  onChange={(e) => {
    setPassword(e.target.value);
    setErrors({ ...errors, password: "" });
  }}
  className={styles.inputField}
  type="password"
  placeholder="Password"
/>

{errors.password && (
  <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
    {errors.password}
  </p>
)}

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

          <div className={styles.cardContainer__right}>
            <div>
          {userLoginMethod
                    ? <p>"Don't have an account? "</p>
                    : <p>'Already have an account? '</p>}
          <div onClick={() => {
            
            setUserLoginMethod(!userLoginMethod)
          }}style={{color: "black", textAlign: "center"}} className={styles.buttonWithOutline}><p>
                  {userLoginMethod
                    ? "Sign Up"
                    :'Sign In'}
                </p></div>
                </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
