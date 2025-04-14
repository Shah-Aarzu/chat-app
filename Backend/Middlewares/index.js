import multer from "multer";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../Models/User.model.js";

cloudinary.config({
  cloud_name: "",
  api_key: "",
  api_secret: "",
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    return cb(null, `image-${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.json({ message: "Not authenticated" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const username = decoded.username;
    let id;
    if (username != undefined) {
      id = await User.findOne({ username });
      req.id = id._id;
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
