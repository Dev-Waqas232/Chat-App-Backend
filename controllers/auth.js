import bcrypt from "bcrypt";

import { User } from "../models/user.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

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

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Login", data: { token: accessToken } });
});

const verify = catchAsync(async (req, res, next) => {});

const refresh = catchAsync(async (req, res, next) => {});

export { register, login, refresh, verify };
