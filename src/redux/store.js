import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./slices/userSlice"
import HabitReducer from "./slices/habitSlice"

export const store = configureStore({
  reducer: {
    user: UserReducer,
    habit : HabitReducer
  },
});
export default store;