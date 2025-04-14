import express from "express";
import { upload } from "../Middlewares/index.js";
import { authMiddleware } from "../Middlewares/index.js";
import {
  createUser,
  loginUser,
  getUsers,
  updateProfile,
  getMessages,
  setMessages,
  deleteMessage,
  userDetail,
  addUser,
  removeUser,
} from "../Controllers/User.controller.js";
import {
  otpGenerator,
  resetPassword,
  verifyOTP,
} from "../Controllers/PasswordReset.Controller.js";

const route = express.Router();

route.post("/createUser", upload.single("profile"), createUser);
route.post("/loginUser", loginUser);
route.post("/otpGenerator", otpGenerator);
route.post("/verifyOTP", verifyOTP);
route.post("/resetPassword", resetPassword);
route.post("/getUsers", authMiddleware, getUsers);
route.post("/userDetail", authMiddleware, userDetail);
route.post("/addUser", authMiddleware, addUser);
route.post("/removeUser", authMiddleware, removeUser);
route.post("/getMessages", authMiddleware, getMessages);
route.post("/setMessages", authMiddleware, setMessages);
route.post("/deleteMessage", authMiddleware, deleteMessage);
route.post(
  "/updateProfile",
  upload.single("profile"),
  authMiddleware,
  updateProfile
);

export default route;
