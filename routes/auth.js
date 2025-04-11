import express from "express";

import { login, refresh, register, verify } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/verify", verify);

router.get("/refresh", refresh);

export { router as AuthRouter };
