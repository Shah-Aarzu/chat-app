import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  errorNotification,
  successNotification,
} from "../../../utils/Notifications";

export const getUsers = createAsyncThunk("getUsers", async (data) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/users/getUsers",
      data
    );

    return res;
  } catch (error) {
    errorNotification(error.message);
  }
});

export const UsersSlice = createSlice({
  name: "users",

  initialState: {
    users: [],
    status: "idle",
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        if (state.users.length == 0) state.status = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.data.users;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default UsersSlice.reducer;
