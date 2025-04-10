import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./utils/dbConnect.js";

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, connectDB());
