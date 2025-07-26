import express from "express";
import {
  forgotPass,
  getMyCourses,
  loginUser,
  logoutUser,
  registerUser,
  userProfile,
} from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgotpassword", auth, forgotPass);
router.get("/profile", auth, userProfile);
router.get("/courses", auth, getMyCourses);
export default router;
