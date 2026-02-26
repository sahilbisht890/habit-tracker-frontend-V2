import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/components/axios/axiosInstance";
import endpoints from "@/components/axios/apiRoutes";

// ====================
// FETCH TRACKED HABITS (BY DATE)
// ====================
export const fetchTrackedHabits = createAsyncThunk(
  "habitTracker/fetchTrackedHabits",
  async (date, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.habitTrackerList, {
        date,
      });
      return { date, data: response.data.data || [] };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetch failed");
    }
  }
);

// ====================
// ADD HABIT TO TRACK (BY DATE)
// ====================
export const addTrackedHabit = createAsyncThunk(
  "habitTracker/addTrackedHabit",
  async ({ habitId, date }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.addNewHabitToTrack, {
        habitId,
        date,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Add failed");
    }
  }
);

// ====================
// UPDATE TRACKED PROGRESS
// ====================
export const updateTrackedProgress = createAsyncThunk(
  "habitTracker/updateTrackedProgress",
  async ({ id, habitId, progress, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(endpoints.updateHabitProgress, {
        id,
        habitId,
        progress,
        status,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

// ====================
// DELETE TRACKED HABIT
// ====================
export const deleteTrackedHabit = createAsyncThunk(
  "habitTracker/deleteTrackedHabit",
  async ({ habitTrackerId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(endpoints.deleteHabitFromTracker, {
        data: { habitTrackerId },
      });
      return habitTrackerId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  }
);

const habitTrackerSlice = createSlice({
  name: "habitTracker",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentDate: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchTrackedHabits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrackedHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.currentDate = action.payload.date;
      })
      .addCase(fetchTrackedHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ADD
      .addCase(addTrackedHabit.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = [action.payload, ...state.items];
        }
      })
      // UPDATE
      .addCase(updateTrackedProgress.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload?._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // DELETE
      .addCase(deleteTrackedHabit.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default habitTrackerSlice.reducer;
