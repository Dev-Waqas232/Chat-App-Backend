import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const validate = catchAsync(async (req, res, next) => {
  const headers = req.headers["authorization"];
  if (!headers) throw new AppError("Token not found", 401);

  const token = headers.split(" ")[1];
  if (!token) throw new AppError("Invalid token", 401);

  const { valid, expired, decoded } = verifyAccessToken(token);

  if (!valid) {
    const message = expired ? "Token expired" : "Invalid token";
    return res.status(401).json({ message });
  }

  req.user = decoded.id;
  next();
});
