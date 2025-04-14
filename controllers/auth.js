import bcrypt from "bcrypt";

import { User } from "../models/user.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) throw new AppError("User already exists", 409);

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  res.status(201).json({ message: "User Created Successfully" });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid Credentials", 404);

  const matchPass = await bcrypt.compare(password, user.password);
  if (!matchPass) throw new AppError("Invalid Credentials", 404);

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Login", data: { token: accessToken } });
});

const verify = catchAsync(async (req, res, next) => {
  const id = req.user;
  const user = await User.findById(id).select("-password -refreshToken");

  if (!user) throw new AppError("User not found", 404);
  res.status(200).json({ message: "Verified", data: { user } });
});

const refresh = catchAsync(async (req, res, next) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new AppError("Refresh Token missing", 400);

  const { valid, expired, decoded } = verifyRefreshToken(token);

  if (!valid) {
    const message = expired ? "Token expired" : "Invalid token";
    return res.status(401).json({ message });
  }

  const newAccessToken = generateAccessToken({ id: decoded.id });
  const newRefreshToken = generateRefreshToken({ id: decoded.id });

  res
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({ data: { token: newAccessToken } });
});

const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export { register, login, refresh, verify, logout };
