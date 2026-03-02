const express = require("express");
const { Puzzle } = require("../models/Puzzle");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

// ─── GET /api/puzzles ─────────────────────────────────────────────────────────
// List all puzzles (stripped of answers/validation logic — that lives server-side)
router.get("/", async (req, res) => {
  try {
    const puzzles = await Puzzle.find({}, "-__v");
    res.json({ puzzles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/puzzles/floor/:floor ───────────────────────────────────────────
// Get puzzle for a specific floor
router.get("/floor/:floor", async (req, res) => {
  try {
    const floor = parseInt(req.params.floor);
    if (isNaN(floor)) return res.status(400).json({ error: "Invalid floor number." });

    const puzzle = await Puzzle.findOne({ floor }, "-__v");
    if (!puzzle) return res.status(404).json({ error: `No puzzle found for floor ${floor}.` });

    res.json({ puzzle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/puzzles/:id ─────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const puzzle = await Puzzle.findOne({ id: req.params.id }, "-__v");
    if (!puzzle) return res.status(404).json({ error: "Puzzle not found." });
    res.json({ puzzle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
