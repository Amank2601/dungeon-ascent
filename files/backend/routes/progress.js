const express = require("express");
const Progress = require("../models/Progress");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All progress routes require authentication
router.use(protect);

// ─── GET /api/progress ───────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user._id });
    if (!progress) {
      progress = await Progress.create({ user: req.user._id });
    }
    res.json({ progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PATCH /api/progress/floor ───────────────────────────────────────────────
router.patch("/floor", async (req, res) => {
  try {
    const { floorDefeated } = req.body;
    if (typeof floorDefeated !== "number" || floorDefeated < -5 || floorDefeated > -1) {
      return res.status(400).json({ error: "Invalid floor number." });
    }

    const progress = await Progress.findOne({ user: req.user._id });
    if (!progress) return res.status(404).json({ error: "Progress not found." });

    if (progress.currentFloor !== floorDefeated) {
      return res.status(400).json({ error: "Floor mismatch. Cannot skip floors." });
    }

    const floorRecord = progress.getFloor(floorDefeated);
    floorRecord.monsterDefeated = true;
    floorRecord.defeatedAt = new Date();

    if (floorDefeated === -1) {
      progress.currentFloor = 0;
      progress.gameCompleted = true;
      progress.gameCompletedAt = new Date();
    } else {
      progress.currentFloor = floorDefeated + 1;
    }

    await progress.save();
    res.json({
      message: progress.gameCompleted ? "🏆 You escaped the dungeon!" : `Floor ${floorDefeated + 1} unlocked!`,
      progress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/progress/attempt ──────────────────────────────────────────────
router.post("/attempt", async (req, res) => {
  try {
    const { puzzleId, code, passed } = req.body;
    if (!puzzleId || !code || typeof passed !== "boolean") {
      return res.status(400).json({ error: "puzzleId, code, and passed are required." });
    }

    const progress = await Progress.findOne({ user: req.user._id });
    if (!progress) return res.status(404).json({ error: "Progress not found." });

    const floorRecord = progress.getFloor(progress.currentFloor);
    floorRecord.attempts.push({ puzzleId, code, passed });
    progress.totalAttempts += 1;
    await progress.save();

    res.json({ message: "Attempt logged.", totalAttempts: progress.totalAttempts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/progress/reset ──────────────────────────────────────────────
router.delete("/reset", async (req, res) => {
  try {
    await Progress.findOneAndReplace(
      { user: req.user._id },
      { user: req.user._id, currentFloor: -5, gameCompleted: false, floors: [], totalAttempts: 0, startedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ message: "Progress reset. You've been pushed back to Floor -5." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
