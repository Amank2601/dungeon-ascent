// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes        = require("./routes/auth");
const progressRoutes    = require("./routes/progress");
const pistonRoutes      = require("./routes/piston");
const leaderboardRoutes = require("./routes/leaderboard");
const dailyRoutes       = require("./routes/daily");

const app = express();

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,         // production Vercel URL
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean); // removes undefined if FRONTEND_URL not set yet

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// General limiter for all /api routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: "Too many requests, slow down." },
});
app.use("/api", limiter);

// Strict limiter for login/register (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
});
app.use("/api/auth/login",    authLimiter);
app.use("/api/auth/register", authLimiter);

// Very strict limiter for OTP (prevent Gmail quota abuse)
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // max 5 OTP requests per hour per IP
  message: { error: "Too many OTP requests. Try again in 1 hour." },
});
app.use("/api/auth/send-otp",        otpLimiter);
app.use("/api/auth/forgot-password", otpLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/progress",    progressRoutes);
app.use("/api/piston",      pistonRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/daily",       dailyRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Never expose internal error details to the client
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message); // logs full error on server
  res.status(err.status || 500).json({
    error: err.status ? err.message : "Something went wrong. Please try again."
  });
});

// ─── Connect MongoDB Atlas + Start ────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB Atlas connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("→ Check MONGO_URI in your .env file");
    process.exit(1);
  });