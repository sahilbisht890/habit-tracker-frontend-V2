import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/components/axios/axiosInstance";
import endpoints from "@/components/axios/apiRoutes";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.login, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// ====================
// REGISTER
// ====================
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.register, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

// ====================
// LOGOUT
// ====================
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.get(endpoints.logout);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

// ====================
// CHECK AUTH
// ====================
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.checkAuthentication);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Not authenticated");
    }
  }
);

// ====================
// UPDATE MODE
// ====================
export const updateMode = createAsyncThunk(
  "auth/updateMode",
  async (mode, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.updateMode, { mode });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update mode failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isAuthenticated: false,
    loading: false,
    authChecking: true,
    error: null,
  },
  reducers: {
    removeUser: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.userData = null;
        state.isAuthenticated = false;
      })
      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.authChecking = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authChecking = false;
        state.userData = action.payload?.user || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.authChecking = false;
        state.userData = null;
        state.isAuthenticated = false;
        state.error = action.payload || null;
      })
      // UPDATE MODE
      .addCase(updateMode.fulfilled, (state, action) => {
        if (state.userData) {
          state.userData = {
            ...state.userData,
            mode: action.payload?.mode || action.payload?.user?.mode || "light",
          };
        }
      });
  },
});

export const { removeUser } = userSlice.actions;
export default userSlice.reducer;
