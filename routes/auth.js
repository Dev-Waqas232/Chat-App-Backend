import express from "express";

import {
  login,
  logout,
  refresh,
  register,
  verify,
} from "../controllers/auth.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/verify", validate, verify);

router.post("/refresh", refresh);

router.post("/logout", logout);

export { router as authRouter };
