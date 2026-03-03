// backend/routes/progress.js
const express = require("express");
const Progress = require("../models/Progress");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect); // all routes require login

// ─── GET /api/progress ────────────────────────────────────────────────────────
// Load player's saved progress from MongoDB
router.get("/", async (req, res) => {
  try {
    let record = await Progress.findOne({ user: req.user._id });

    // Safety net — create if missing (shouldn't happen after register)
    if (!record) {
      record = await Progress.create({
        user: req.user._id,
        data: {
          worlds: {},
          totalXP: 0,
          introDone: false,
          selectedLanguage: "javascript",
        },
      });
    }

    res.json({ progress: record.data });
  } catch (err) {
    console.error("Get progress error:", err.message);
    res.status(500).json({ error: "Failed to load progress" });
  }
});

// ─── POST /api/progress ───────────────────────────────────────────────────────
// Save (overwrite) full progress to MongoDB
// Body: { progress: { worlds: {...}, totalXP: 500, introDone: true, selectedLanguage: "python" } }
router.post("/", async (req, res) => {
  try {
    const { progress } = req.body;

    if (!progress || typeof progress !== "object") {
      return res.status(400).json({ error: "Invalid progress data" });
    }

    const updated = await Progress.findOneAndUpdate(
      { user: req.user._id },
      { $set: { data: progress } },
      { new: true, upsert: true, runValidators: false }
    );

    res.json({ progress: updated.data, savedAt: updated.updatedAt });
  } catch (err) {
    console.error("Save progress error:", err.message);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

// ─── DELETE /api/progress ─────────────────────────────────────────────────────
// Reset progress (Play Again)
router.delete("/", async (req, res) => {
  try {
    const reset = {
      worlds: {},
      totalXP: 0,
      introDone: false,
      selectedLanguage: "javascript",
    };

    await Progress.findOneAndUpdate(
      { user: req.user._id },
      { $set: { data: reset } },
      { upsert: true }
    );

    res.json({ progress: reset });
  } catch (err) {
    console.error("Reset progress error:", err.message);
    res.status(500).json({ error: "Failed to reset progress" });
  }
});

module.exports = router;