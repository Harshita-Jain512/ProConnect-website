// src/redux/store.js

import { configureStore } from "@reduxjs/toolkit";
// ✅ CORRECT:
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";


/**
 * STEPS for state management
 * 1. Submit action
 * 2. Handle action in its reducer
 * 3. Register reducer here
 */

 const store = configureStore({
  reducer: {
    auth: authReducer,
    postReducer: postReducer
  }
});
export default store;
