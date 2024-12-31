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
const allowedOrigins = ["https://grand-brigadeiros-4a3caf.netlify.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
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
