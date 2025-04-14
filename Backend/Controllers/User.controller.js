import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../Models/User.model.js";
import moment from "moment-timezone";
import mongoose from "mongoose";
import { io, getReceiverSocketId } from "../index.js";

export const createUser = async (req, res) => {
  try {
    console.log("createUser");

    const { fullname, username, email, password, bio } = req.body;
    const filename = req.file ? req.file.filename : "";
    let imageUrl = "";

    const createdAt = moment(Date.now())
      .tz("Asia/Kolkata")
      .format("HH:mm:ss DD-MM-YYYY");

    let existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.json({ message: "User already exists", created: false });
    }

    if (filename != "") {
      imageUrl = await cloudinary.uploader.upload(req.file.path);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      profile: imageUrl != "" ? imageUrl.secure_url : "",
      fullname,
      username,
      email,
      password: hashedPassword,
      bio,
      createdAt,
    });
    await newUser.save();

    res.json({ message: "User Created Successfully", created: true, newUser });
  } catch (err) {
    res.json({ message: "Server error" });
  }
};

export const userDetail = async (req, res) => {
  try {
    console.log("userDetail");
    const { id } = req;

    const userData = await User.findOne(
      { _id: id },
      { profile: 1, fullname: 1, username: 1, email: 1, bio: 1 }
    );

    res.json({
      message: "User Data Fetched Successfully",
      userData,
    });
  } catch (err) {
    res.json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("updateProfile");
    const { fullname, username, email, bio } = req.body;
    const { id } = req;
    const filename = req.file ? req.file.filename : "";
    let imageUrl = "";

    if (filename != "") {
      imageUrl = await cloudinary.uploader.upload(req.file.path);
    }

    if (imageUrl)
      await User.updateOne(
        { _id: id },
        { fullname, bio, profile: imageUrl.secure_url }
      );
    else await User.updateOne({ _id: id }, { fullname, bio });

    return res.json({
      message: "Profile Updated Successfully",
    });
  } catch (err) {
    res.json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log("loginUser");

    const { username, password } = req.body;
    let token = "";

    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ message: "Invalid credentials", auth: false, token });
    }

    token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Logged in", userId: user._id, auth: true, token });
  } catch (error) {
    res.json({ message: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    console.log("getUsers");
    const { search } = req.body;
    const { id } = req;
    let users = [];
    if (search === "allUsers") {
      users = await User.find(
        {},
        {
          fullname: 1,
          username: 1,
          profile: 1,
        }
      );
      return res.json({ message: "Users Fetched Successfully", users });
    }

    if (search) {
      users = await User.find(
        {
          $or: [
            { fullname: { $regex: ".*" + search + ".*", $options: "i" } },
            { username: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
          _id: { $ne: id }
        },
        { fullname: 1, username: 1, profile: 1 }
      );

    }
    if (users.length > 0)
      return res.json({ message: "User Fetched Successfully", users });
    res.json({ message: "User Not Found", users });
  } catch (err) {
    res.json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    console.log("getMessages");
    const { id } = req;

    const messages = await User.findOne(
      { _id: id },
      { messages: 1, username: 1 }
    );

    res
      .status(200)
      .json({ message: "Messages Fetched Successfully", messages });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const setMessages = async (req, res) => {
  try {
    console.log("setMessages");
    const { id } = req;
    const { username, message, receiverId } = req.body;

    const myDetail = await User.findOne({ _id: id });
    const userDetail = await User.findOne({ username });

    const createdAt = moment(Date.now())
      .tz("Asia/Kolkata")
      .format("HH:mm:ss DD-MM-YYYY");

    const _id = new mongoose.Types.ObjectId();

    await User.updateOne(
      {
        _id: id,
        messages: { $elemMatch: { username: username } },
      },
      {
        $push: {
          "messages.$.chats": {
            username,
            message,
            createdAt,
            _id,
          },
        },
      }
    );
    await User.updateOne(
      {
        _id: userDetail._id,
        messages: { $elemMatch: { username: myDetail.username } },
      },
      {
        $push: {
          "messages.$.chats": {
            username,
            message,
            createdAt,
            _id,
          },
        },
      }
    );

    const receiverNewMessage = { username, message, createdAt, _id };
    const senderNewMessage = { username, message, createdAt, _id };

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        newMessage: receiverNewMessage,
        id: id + "",
      });
    }

    const senderSocketId = getReceiverSocketId(id);
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", {
        newMessage: senderNewMessage,
        id: receiverId,
      });
    }

    res.status(200).json({ message: "Messages Send Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    console.log("deleteMessage");

    const { id } = req;
    const { _id, username } = req.body;
    const messageId = new mongoose.Types.ObjectId(_id);
    console.log(username);

    await User.updateOne(
      {
        _id: id,
        messages: { $elemMatch: { username } },
      },
      {
        $pull: {
          "messages.$.chats": { _id: messageId },
        },
      }
    );

    res.status(200).json({ message: "Messages Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addUser = async (req, res) => {
  try {
    console.log("addUser");

    const { username } = req.body;

    const { id } = req;

    let result = await User.findOne({ username });

    const users = await User.findOne(
      { _id: id },
      { profile: 1, username: 1, fullname: 1, _id: 0 }
    );

    let messagesId = await User.findOne({
      _id: id,
      messages: { $elemMatch: { id: result._id } },
    });

    if (messagesId === null) {
      await User.updateOne(
        { _id: id },
        {
          $push: {
            messages: {
              id: result._id,
              profile: result.profile,
              fullname: result.fullname,
              username: result.username,
              chats: [],
            },
          },
        }
      );
    }

    messagesId = null;

    messagesId = await User.findOne({
      username,
      messages: { $elemMatch: { id: id } },
    });

    if (messagesId === null) {
      await User.updateOne(
        { _id: result._id },
        {
          $push: {
            messages: {
              id: id,
              profile: users.profile,
              fullname: users.fullname,
              username: users.username,
              chats: [],
            },
          },
        }
      );
    }


    res.status(200).json({ message: "User Added Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeUser = async (req, res) => {
  try {
    console.log("removeUser");

    const { username } = req.body;
    const { id } = req;

    await User.updateOne({ _id: id }, { $pull: { messages: { username } } })

    res.status(200).json({ message: "User Removed Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};