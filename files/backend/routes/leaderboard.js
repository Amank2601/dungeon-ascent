// backend/routes/leaderboard.js
const express = require("express");
const Progress = require("../models/Progress");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const records = await Progress.find({})
      .sort({ "data.totalXP": -1 })
      .limit(20)
      .populate("user", "username");

    const board = records
      .filter(r => r.user)
      .map((r, i) => {
        const d = r.data || {};
        const worldsCompleted = Object.values(d.worlds||{}).filter(w=>w.bossDefeated).length;
        return {
          rank: i + 1,
          username: r.user.username,
          totalXP: d.totalXP || 0,
          worldsCompleted,
          selectedLanguage: d.selectedLanguage || "javascript",
          isYou: r.user._id.toString() === req.user._id.toString(),
        };
      });

    const yourRecord = await Progress.findOne({ user: req.user._id });
    const yourXP     = yourRecord?.data?.totalXP || 0;
    const yourRank   = await Progress.countDocuments({ "data.totalXP": { $gt: yourXP } }) + 1;

    res.json({ board, yourRank, yourXP });
  } catch (err) {
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

module.exports = router;