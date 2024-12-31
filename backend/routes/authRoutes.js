import express from "express";
import {
  Login,
  Logout,
  Register,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  resetAccountOtp,
  verifyResetAccount,
  verifyResetOtp,
  resendResetOtp,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRoutes = express.Router();

authRoutes.post("/register", Register);
authRoutes.post("/login", Login);
authRoutes.post("/logout", Logout);
authRoutes.post("/send-verify", userAuth, sendVerifyOtp);
authRoutes.post("/verify", userAuth, verifyEmail);
authRoutes.post("/is-auth", userAuth, isAuthenticated);
authRoutes.post("/reset-otp", resetAccountOtp);
authRoutes.post("/verify-reset-otp", verifyResetOtp);
authRoutes.post("/resend-reset-otp", resendResetOtp);
authRoutes.post("/verify-reset", verifyResetAccount);

export default authRoutes;
