import express from "express";
import { userData } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRoute = express.Router();

userRoute.get("/user-data",userAuth, userData);

export default userRoute;
