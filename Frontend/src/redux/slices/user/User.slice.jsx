import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  errorNotification,
  successNotification,
} from "../../../utils/Notifications";

export const userData = createAsyncThunk("userData", async (data) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/users/createUser",
      data
    );
    return res;
  } catch (error) {
    errorNotification(error.message);
  }
});

export const userDetail = createAsyncThunk("userDetail", async (data) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/users/userDetail",
      data
    );
    return res;
  } catch (error) {
    errorNotification(error.message);
  }
});

export const updateProfile = createAsyncThunk("updateProfile", async (data) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/users/updateProfile",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res;
  } catch (error) {
    errorNotification(error.message);
  }
});

export const userSlice = createSlice({
  name: "user",

  initialState: {
    userData: null,
    status: "idle",
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(userData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userData = action.payload.data;
      })
      .addCase(userData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(userDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userData = action.payload.data;
      })
      .addCase(userDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.userData = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
