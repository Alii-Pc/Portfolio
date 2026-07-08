import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://portfolio-qbi3.vercel.app",
  credentials: true,
}));
app.use(express.json());

// Database connection middleware for Serverless environments (Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection middleware error:", err.message);
    res.status(500).json({ message: "Database connection failed. Please try again." });
  }
});


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

// Health Check / Default Root
app.get("/", (req, res) => {
  res.send("Portfolio Backend API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
}

export default app;
