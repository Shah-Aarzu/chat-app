import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { errorNotification } from "../../../utils/Notifications";

export const userAuth = createAsyncThunk("userAuth", async (data) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/users/loginUser",
      data
    );
    return res;
  } catch (error) {
    errorNotification(error.message);
  }
});

export const userAuthSlice = createSlice({
  name: "userAuth",

  initialState: {
    userAuth: localStorage.getItem("userToken") ? true : false,
    userId: null,
    loading: false,
    error: null,
  },

  reducers: {
    userLogout: (state) => {
      localStorage.removeItem("userToken");
      state.userAuth = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(userAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(userAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data.token.length > 0) {
          state.userAuth = true;
          state.userId = action.payload.data.userId;

          localStorage.setItem("userToken", action.payload.data.token);
        }
      })
      .addCase(userAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { userLogout } = userAuthSlice.actions;
export default userAuthSlice.reducer;
