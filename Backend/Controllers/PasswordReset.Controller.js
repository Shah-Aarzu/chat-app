import { OTP } from "../Models/Otp.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { User } from "../Models/User.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

let email = "";
let otp = 0;

export const otpGenerator = async (req, res) => {
  try {
    email = req.body.email;

    const user = await User.findOne({ email }, { email: 1 });

    if (!user) return res.json({ message: "Invalid Email" }).status(400);

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ email: user.email });
    await OTP.create({ email: user.email, otp, expiresAt });

    const mailOptions = {
      from: process.env.EMAIL,
      to: "aarzumustafa4@gmail.com",
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 5 Minutes.`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error)
        return res
          .json({ message: "Error sending OTP", otpSend: false })
          .status(500);

      res.json({ message: "OTP sent successfully", otpSend: true });
    });
  } catch (error) {
    res.json({ message: "Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    otp = req.body.otp;

    const record = await OTP.findOne({ email, otp });

    if (!record)
      return res
        .json({ message: "Invalid or expired OTP", otpVerify: false })
        .status(400);

    res.json({ message: "OTP verified successfully", otpVerify: true });
  } catch (error) {
    res.json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { confirmNewPassword } = req.body;

    const record = await OTP.findOne({ email, otp });
    if (!record)
      return res.json({ message: "Invalid or expired OTP" }).status(400);

    const hashedPassword = await bcrypt.hash(confirmNewPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    await OTP.deleteOne({ email, otp });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.json({ message: "Server error" });
  }
};
