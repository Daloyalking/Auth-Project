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
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://grand-brigadeiros-4a3caf.netlify.app", // Netlify frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Required for cookies
  })
);
app.use(express.json());

app.use(cookieParser());

// API Endpoint
app.get("/", (req, res) => {
  res.send("Server Started");
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);


app.use((req, res, next) => {
  console.log("CORS request from origin:", req.headers.origin);
  next();
});

app.listen(Port, (req, res) => {
  console.log(`Server started successfully on port ${Port}`);
});
