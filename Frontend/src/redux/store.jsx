import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user/User.slice";
import userAuthReducer from "./slices/user/UserAuth.slice";
import UsersReducer from "./slices/user/GetUsers.slice";
import MessagesReducer from "./slices/user/Messages.slice";
import ResetPasswordReducer from "./slices/user/ResetPassword.slice";
import socketReducer from "./slices/user/SocketSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    userAuth: userAuthReducer,
    users: UsersReducer,
    messages: MessagesReducer,
    resetPassword: ResetPasswordReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
