import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import PostRouter from "./routes/Posts.js";
import GenerateImageRouter from "./routes/GenerateImage.js";

dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();

// CORS Configuration
const allowedOrigins = [
  'https://image-generator-mern.vercel.app',
  'http://localhost:3000', // Replace with your frontend port if different
  'http://localhost:3001', // Replace with your frontend port if different
];

// Handle CORS and preflight requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Routers
app.use("/api/post", PostRouter);
app.use("/api/generateImage", GenerateImageRouter);

// Default get
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to The AI Image Generator APP.",
  });
});

// Function to connect to MongoDB
const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.error("Failed to connect to DB");
      console.error(err);
    });
};

// Function to start the server
const startServer = async () => {
  try {
    connectDB();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
