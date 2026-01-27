import express from "express";
import { signUp, logIn, logOut, refreshToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);
router.post("/refresh", refreshToken);

export default router;
