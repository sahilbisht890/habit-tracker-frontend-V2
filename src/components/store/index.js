import { configureStore } from "@reduxjs/toolkit";
import habitReducer from "./slices/habitSlice";
import habitTrackerReducer from "./slices/habitTrackerSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    habit: habitReducer,
    habitTracker: habitTrackerReducer,
  },
});

export default store;
