// backend/routes/auth.js
const express  = require("express");
const jwt      = require("jsonwebtoken");
const crypto   = require("crypto");
const bcrypt   = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { sendOTPEmail } = require("../utils/mailer");
const User     = require("../models/User");
const Progress = require("../models/Progress");
const { protect } = require("../middleware/auth");

const router       = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// In-memory stores
const otpStore          = new Map(); // signup OTPs
const resetStore        = new Map(); // password reset OTPs

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
function makeOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// ─── POST /api/auth/google ────────────────────────────────────────────────────
router.post("/google", async (req, res) => {
  try {
    const { credential, username } = req.body;
    if (!credential) return res.status(400).json({ error: "No credential provided." });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, sub: googleId, email_verified } = ticket.getPayload();
    if (!email_verified) return res.status(400).json({ error: "Google email not verified." });

    const normalEmail = email.toLowerCase();
    let user = await User.findOne({ email: normalEmail });
    if (user) {
      if (!user.googleId) { user.googleId = googleId; await user.save(); }
      return res.json({ token: signToken(user._id), user: { id: user._id, username: user.username, email: user.email } });
    }

    if (!username) {
      let suggested = name.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 18) || "Warrior";
      if (await User.findOne({ username: suggested }))
        suggested = suggested.slice(0, 14) + Math.floor(Math.random() * 999);
      return res.json({ needsUsername: true, suggestedUsername: suggested, email: normalEmail });
    }

    const trimmed = username.trim();
    if (trimmed.length < 3)  return res.status(400).json({ error: "Username too short." });
    if (trimmed.length > 20) return res.status(400).json({ error: "Username too long." });
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return res.status(400).json({ error: "Letters, numbers, underscores only." });
    if (await User.findOne({ username: trimmed })) return res.status(409).json({ error: "Username taken. Pick another." });

    user = await User.create({
      username: trimmed, email: normalEmail,
      googleId, authProvider: "google",
      password: "google_" + googleId + "_" + Date.now(),
    });
    await Progress.create({ user: user._id, data: { worlds: {}, totalXP: 0, introDone: false, selectedLanguage: "javascript" } });
    return res.status(201).json({ token: signToken(user._id), user: { id: user._id, username: user.username, email: user.email } });

  } catch (err) {
    console.error("Google auth error:", err.message);
    res.status(401).json({ error: "Google sign-in failed. Try again." });
  }
});

// ─── POST /api/auth/send-otp (signup) ────────────────────────────────────────
router.post("/send-otp", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields are required." });
    if (username.trim().length < 3)
      return res.status(400).json({ error: "Username must be at least 3 characters." });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: "Invalid email format." });

    const normalEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ $or: [{ email: normalEmail }, { username: username.trim() }] });
    if (existing) {
      return res.status(409).json({
        error: existing.email === normalEmail ? "Email already registered." : "Username already taken.",
      });
    }

    const prev = otpStore.get(normalEmail);
    if (prev && prev.sentAt > Date.now() - 60000) {
      const wait = Math.ceil((60000 - (Date.now() - prev.sentAt)) / 1000);
      return res.status(429).json({ error: "Wait " + wait + "s before requesting a new code." });
    }

    const otp = makeOTP();
    otpStore.set(normalEmail, {
      otp, sentAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
      userData: { username: username.trim(), email: normalEmail, password },
    });
    setTimeout(() => otpStore.delete(normalEmail), 10 * 60 * 1000);

    await sendOTPEmail(normalEmail, username.trim(), otp, "signup");
    res.json({ message: "Code sent! Check your inbox.", email: normalEmail });
  } catch (err) {
    console.error("send-otp error:", err.message);
    res.status(500).json({ error: "Failed to send email. Make sure your email address is correct." });
  }
});

// ─── POST /api/auth/verify-otp (signup) ──────────────────────────────────────
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and code required." });

    const normalEmail = email.toLowerCase().trim();
    const record = otpStore.get(normalEmail);

    if (!record) return res.status(400).json({ error: "Code expired or not found. Request a new one." });
    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalEmail);
      return res.status(400).json({ error: "Code expired. Request a new one." });
    }
    record.attempts += 1;
    if (record.attempts > 5) {
      otpStore.delete(normalEmail);
      return res.status(400).json({ error: "Too many wrong attempts. Request a new code." });
    }
    if (record.otp !== otp.trim()) {
      const left = 5 - record.attempts;
      return res.status(400).json({ error: "Wrong code. " + left + " attempt" + (left === 1 ? "" : "s") + " left." });
    }

    otpStore.delete(normalEmail);
    const { username, password } = record.userData;
    const dupe = await User.findOne({ $or: [{ email: normalEmail }, { username }] });
    if (dupe) return res.status(409).json({ error: "Account already exists." });

    const user = await User.create({ username, email: normalEmail, password, authProvider: "local" });
    await Progress.create({ user: user._id, data: { worlds: {}, totalXP: 0, introDone: false, selectedLanguage: "javascript" } });
    res.status(201).json({ token: signToken(user._id), user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error("verify-otp error:", err.message);
    res.status(500).json({ error: "Account creation failed. Try again." });
  }
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const normalEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalEmail });

    // Always return success to avoid user enumeration
    if (!user || user.authProvider === "google") {
      return res.json({ message: "If that email exists, a reset code has been sent." });
    }

    const prev = resetStore.get(normalEmail);
    if (prev && prev.sentAt > Date.now() - 60000) {
      const wait = Math.ceil((60000 - (Date.now() - prev.sentAt)) / 1000);
      return res.status(429).json({ error: "Wait " + wait + "s before requesting a new code." });
    }

    const otp = makeOTP();
    resetStore.set(normalEmail, {
      otp, sentAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
    });
    setTimeout(() => resetStore.delete(normalEmail), 10 * 60 * 1000);

    await sendOTPEmail(normalEmail, user.username, otp, "reset");
    res.json({ message: "If that email exists, a reset code has been sent.", email: normalEmail });
  } catch (err) {
    console.error("forgot-password error:", err.message);
    res.status(500).json({ error: "Failed to send reset email. Try again." });
  }
});

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ error: "All fields required." });
    if (newPassword.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters." });

    const normalEmail = email.toLowerCase().trim();
    const record = resetStore.get(normalEmail);

    if (!record) return res.status(400).json({ error: "Code expired or not found. Request a new one." });
    if (Date.now() > record.expiresAt) {
      resetStore.delete(normalEmail);
      return res.status(400).json({ error: "Code expired. Request a new one." });
    }
    record.attempts += 1;
    if (record.attempts > 5) {
      resetStore.delete(normalEmail);
      return res.status(400).json({ error: "Too many wrong attempts. Request a new code." });
    }
    if (record.otp !== otp.trim()) {
      const left = 5 - record.attempts;
      return res.status(400).json({ error: "Wrong code. " + left + " attempt" + (left === 1 ? "" : "s") + " left." });
    }

    resetStore.delete(normalEmail);
    const user = await User.findOne({ email: normalEmail });
    if (!user) return res.status(404).json({ error: "Account not found." });

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    res.json({ message: "Password updated! You can now sign in." });
  } catch (err) {
    console.error("reset-password error:", err.message);
    res.status(500).json({ error: "Password reset failed. Try again." });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (user && user.authProvider === "google")
      return res.status(401).json({ error: "This email uses Google sign-in. Please use the Google button." });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid email or password." });

    res.json({ token: signToken(user._id), user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get("/me", protect, (req, res) => {
  res.json({ user: { id: req.user._id, username: req.user.username, email: req.user.email } });
});

module.exports = router;