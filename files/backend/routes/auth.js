// backend/routes/auth.js
const express  = require("express");
const jwt      = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User     = require("../models/User");
const Progress = require("../models/Progress");
const { protect } = require("../middleware/auth");

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// ─── POST /api/auth/google ────────────────────────────────────────────────────
// Step 1 (no username): verify Google token
//   - existing user → log in immediately
//   - new user → return needsUsername: true so frontend shows username picker
// Step 2 (with username): create account with chosen username
router.post("/google", async (req, res) => {
  try {
    const { credential, username } = req.body;
    if (!credential) return res.status(400).json({ error: "No credential provided." });

    // Always verify the Google token first
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ error: "Google email is not verified." });
    }

    const normalEmail = email.toLowerCase();

    // ── Existing user → just log in ──────────────────────────────────────────
    let user = await User.findOne({ email: normalEmail });
    if (user) {
      if (!user.googleId) { user.googleId = googleId; await user.save(); }
      const token = signToken(user._id);
      return res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    }

    // ── New user, no username yet → ask frontend to show username picker ─────
    if (!username) {
      // Suggest a username from their Google display name
      let suggested = name.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 18) || "Warrior";
      const taken = await User.findOne({ username: suggested });
      if (taken) suggested = suggested.slice(0, 14) + Math.floor(Math.random() * 999);
      return res.json({ needsUsername: true, suggestedUsername: suggested, email: normalEmail });
    }

    // ── New user with chosen username → create account ───────────────────────
    const trimmed = username.trim();
    if (trimmed.length < 3) return res.status(400).json({ error: "Username too short." });
    if (trimmed.length > 20) return res.status(400).json({ error: "Username too long." });
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed))
      return res.status(400).json({ error: "Username: letters, numbers, underscores only." });

    const usernameTaken = await User.findOne({ username: trimmed });
    if (usernameTaken) return res.status(409).json({ error: "Username already taken. Pick another." });

    user = await User.create({
      username: trimmed,
      email: normalEmail,
      googleId,
      password: `google_oauth_${googleId}_${Date.now()}`,
    });

    await Progress.create({
      user: user._id,
      data: { worlds: {}, totalXP: 0, introDone: false, selectedLanguage: "javascript" },
    });

    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });

  } catch (err) {
    console.error("Google OAuth error:", err.message);
    res.status(401).json({ error: "Google sign-in failed. Try again." });
  }
});

// ─── POST /api/auth/register (email+password fallback) ───────────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields are required." });
    if (username.trim().length < 3)
      return res.status(400).json({ error: "Username must be at least 3 characters." });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters." });

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { username: username.trim() }],
    });
    if (existing) {
      return res.status(409).json({
        error: existing.email === email.toLowerCase().trim()
          ? "Email already registered." : "Username already taken.",
      });
    }

    const user = await User.create({ username: username.trim(), email: email.toLowerCase(), password });
    await Progress.create({
      user: user._id,
      data: { worlds: {}, totalXP: 0, introDone: false, selectedLanguage: "javascript" },
    });

    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: Object.values(err.errors)[0].message });
    }
    res.status(500).json({ error: "Registration failed." });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid email or password." });

    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get("/me", protect, (req, res) => {
  res.json({ user: { id: req.user._id, username: req.user.username, email: req.user.email } });
});

module.exports = router;