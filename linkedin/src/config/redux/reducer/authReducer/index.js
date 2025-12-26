import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  getConnectionsRequest,
  getMyConnectionRequests,
  loginUser,
  registerUser,
  sendConnectionRequest,
  AcceptConnection
} from "../../action/authAction";


const initialState = {
  user: undefined, 
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users: [],
  all_profiles_fetching: false,
  all_profiles_fetched: false 

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔐 Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Knocking the door...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login is successful";
        state.user = action.payload.user; // ✅ correct
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Login failed";
      })

      // 📝 Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you...";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Registration is successful, please login";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Registration failed";
      })

      // 👤 Get About User
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
         state.loggedIn = true; 
        state.user = action.payload.profile; // ✅ sets proper user object
       // state.connections = action.payload.connections;
        //state.connectionRequest = action.payload.connectionRequest;
      })

      // 👥 Get All Users
      .addCase(getAllUsers.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isError = false;
  //state.all_profiles_fetching = false;
  state.all_users = action.payload.profiles; // ✅ fixed key
  state.all_profiles_fetched = true;
})

    .addCase(getConnectionsRequest.fulfilled, (state, action) => {
  state.connections = action.payload;
  })
      .addCase(getConnectionsRequest.rejected, (state, action) => {
  state.message = action.payload ;
      })
      .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
  state.connectionRequest = action.payload;
  })
      .addCase(getMyConnectionRequests.rejected, (state, action) => {
  state.message = action.payload ;
      })

      // ✅ Handle sendConnectionRequest 
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
  state.isSuccess = true;

  // Optional: mark request as pending
  state.connectionRequest.push(action.payload);
})
.addCase(sendConnectionRequest.rejected, (state, action) => {
  state.isError = true;
  state.message = action.payload;
});



  },
});

// 🧩 Export actions and reducer
export const {
  reset,
  emptyMessage,
  setTokenIsThere,
  setTokenIsNotThere
} = authSlice.actions;

export default authSlice.reducer;
export { authSlice }
