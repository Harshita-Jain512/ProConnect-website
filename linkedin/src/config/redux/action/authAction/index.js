import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password
      });

      const { token, user: userInfo } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        return { user: userInfo, token }; // ✅ Return complete payload
      } else {
        return thunkAPI.rejectWithValue("Token not provided");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name
      });

      return response.data; // ✅ Must return something on success

    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_user_and_profile", {
        params: {
          token: user.token
        }
      });

      const userData = response.data;

      return thunkAPI.fulfillWithValue({
        profile: userData.userId,              // ✅ Send proper user object
        connections: userData.connections || [],
        connectionRequest: userData.connectionRequest || []
      });

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "User fetch failed");
    }
  }
);


export const getAllUsers = createAsyncThunk(
  "user/getAllUser" , 
  async(_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users");
      console.log("getAllUsers response.data:", response.data);

      return thunkAPI.fulfillWithValue(response.data)
    } catch (err){
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
)

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (data, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          token: data.token,
          connectionId: data.user_id   // ✅ FIX
        }
      )
      thunkAPI.dispatch(getConnectionsRequest({ token: data.token })); // Refresh user data

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message
      );
    }
  }
);

export const getConnectionsRequest = createAsyncThunk(
  "user/getConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/getConnectionRequests", {
        params: {
          token: user.token
        }
      });
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data || "Fetch failed");
    }
  }
);

export const getMyConnectionRequests  = createAsyncThunk(
  "user/getMyConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/user_connection_request", {
        params: {
          token: user.token
        }
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const AcceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (user, thunkAPI) => {
    try{
      const response = await clientServer.post("/user/accept_connection_request", {
        token: user.token,
        requestId: user.connectionId,
        action_type: user.action
      });
      thunkAPI.dispatch(getConnectionsRequest({ token: user.token }));
      thunkAPI.dispatch(getMyConnectionRequests({ token: user.token }));
      return thunkAPI.fulfillWithValue(response.data);
    }catch(error){
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);