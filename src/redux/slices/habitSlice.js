import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/components/axios/axiosInstance";
import endpoints from "@/components/axios/apiRoutes";

// ====================
// FETCH ALL HABITS
// ====================
export const fetchHabits = createAsyncThunk(
  "habit/fetchHabits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.userHabitList);
      console.log('Fetched habits:', response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetch failed");
    }
  }
);

// ====================
// UPDATE HABIT
// ====================
export const updateHabit = createAsyncThunk(
  "habit/updateHabit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${endpoints.updateHabit}/${id}`,
        data
      );
      return response.data.habit;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

// ====================
// DELETE HABIT
// ====================
export const deleteHabit = createAsyncThunk(
  "habit/deleteHabit",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${endpoints.deleteUserHabit}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  }
);

const habitSlice = createSlice({
  name: "habit",
  initialState: {
    habits: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateHabit.fulfilled, (state, action) => {
        const index = state.habits.findIndex(
          (habit) => habit._id === action.payload._id
        );
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.habits = state.habits.filter(
          (habit) => habit._id !== action.payload
        );
      });
  },
});

export default habitSlice.reducer;