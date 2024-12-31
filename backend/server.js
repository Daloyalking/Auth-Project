import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import ConnectDB from "./config/mongoDB.js";
import authRoutes from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";

// App Config
const app = express();
const Port = process.env.PORT || 4000;
ConnectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://grand-brigadeiros-4a3caf.netlify.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// API Endpoint
app.get("/", (req, res) => {
  res.send("Server Started");
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);

app.listen(Port, (req, res) => {
  console.log(`Server started successfully on port ${Port}`);
});
