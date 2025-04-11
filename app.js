import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./utils/dbConnect.js";
import errorHandler from "./middlewares/errorHandler.js";
import { authRouter } from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, connectDB());
