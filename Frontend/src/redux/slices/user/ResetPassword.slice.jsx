import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { errorNotification } from "../../../utils/Notifications";

export const getOTP = createAsyncThunk("getOTP", async (data) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/users/otpGenerator",
      data
    );

    return res;
  } catch (error) {
    errorNotification(error.message);
  }
});

export const sendOTP = createAsyncThunk("sendOTP", async (data) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/users/verifyOTP",
      data
    );

    return res;
  } catch (error) {
    errorNotification(error.message);
  }
});

export const resetPassword = createAsyncThunk("resetPassword", async (data) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/users/resetPassword",
      data
    );

    return res;
  } catch (error) {
    errorNotification(error.message);
  }
});

export const ResetPasswordSlice = createSlice({
  name: "ResetPassword",

  initialState: {
    data: null,
    status: "idle",
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getOTP.pending, (state) => {
        if (state.data == null) state.status = "loading";
      })
      .addCase(getOTP.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
      })
      .addCase(getOTP.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default ResetPasswordSlice.reducer;
