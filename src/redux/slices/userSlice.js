import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,          // object | null
  isAuthenticated: false,  // boolean
  mode: "light",           // "light" | "dark"
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /* -------- Auth -------- */
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },

    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
    },

    /* -------- Theme -------- */
    setMode: (state, action) => {
      state.mode = action.payload; // "light" or "dark"
    },

    toggleMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const {
  setIsAuthenticated,
  setUserInfo,
  loginSuccess,
  logout,
  setMode,
  toggleMode,
} = userSlice.actions;

export default userSlice.reducer;