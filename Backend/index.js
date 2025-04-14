import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import userRouter from "./Routes/User.route.js";
import "dotenv/config";
import { connectDB } from "./DB/index.js";
import { createServer } from "http";
import { Server } from "socket.io";

connectDB();

const app = express();

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

const users = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    users[userId] = socket.id;
    io.emit("userisOnline", { flag: true, id: userId });

  }
  let user;
  socket.on("isUserOnline", (chatId) => {
    if (chatId) {
      user = getReceiverSocketId(chatId);
    }
    if (user) socket.emit("userisOnline", { flag: true, id: chatId });
    else socket.emit("userisOnline", { flag: false, id: chatId });
  });

  socket.on("userisTyping", (chatId) => {
    if (chatId) {
      user = getReceiverSocketId(chatId);

    }

    if (user) {
      socket.to(user).emit("userTyping", { flag: true, userId });
    }
  });



  socket.on("stopTyping", async (chatId) => {
    if (chatId) {
      user = getReceiverSocketId(chatId);

    }

    if (user) {
      socket.to(user).emit("hideTyping", { flag: false, userId });
    }
  });

  socket.on("getDeleteMessageId", ({ messageId }) => {

    socket.emit("sendDeleteMessageId", { messageId });
  });

  socket.on("disconnect", () => {
    delete users[userId];
    io.emit("userisOnline", { flag: false, id: userId });
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/users", userRouter);

server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
