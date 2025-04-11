import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./utils/dbConnect.js";
import AppError from "./utils/AppError.js";

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

// Unknown route handler
app.use("*", (req, res, next) => {
  next(new AppError("Route not found", 404));
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, connectDB());
