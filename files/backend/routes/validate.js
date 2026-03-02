const express = require("express");
const { VM } = require("vm2");
const { Puzzle } = require("../models/Puzzle");
const Progress = require("../models/Progress");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

// Validation functions per puzzle (server-side — the source of truth)
const VALIDATORS = {
  p1: (fn) => fn(3) === "Fizz" && fn(5) === "Buzz" && fn(15) === "FizzBuzz" && fn(7) === "7",
  p2: (fn) => {
    const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    return eq(fn([1,2,3]), [3,2,1]) && eq(fn(["a","b","c"]), ["c","b","a"]) && eq(fn([42]), [42]);
  },
  p3: (fn) => fn(0) === 1 && fn(1) === 1 && fn(5) === 120 && fn(7) === 5040,
  p4: (fn) => fn([1,2,3,2,4]) === 2 && fn([5,1,5,2,3]) === 5 && fn([1,2,3]) === null,
  p5: (fn) =>
    fn("listen", "silent") === true &&
    fn("hello", "world") === false &&
    fn("Astronomer", "Moon starer") === true,
};

// ─── POST /api/validate ───────────────────────────────────────────────────────
// Body: { puzzleId: "p1", code: "function fizzBuzz(n) { ... }" }
router.post("/", async (req, res) => {
  const { puzzleId, code } = req.body;

  if (!puzzleId || !code) {
    return res.status(400).json({ error: "puzzleId and code are required." });
  }

  const puzzle = await Puzzle.findOne({ id: puzzleId });
  if (!puzzle) return res.status(404).json({ error: "Puzzle not found." });

  const validator = VALIDATORS[puzzleId];
  if (!validator) return res.status(400).json({ error: "No validator for this puzzle." });

  let passed = false;
  let errorMessage = null;
  let testResults = [];

  try {
    // Run user code in a sandboxed VM (vm2) with a timeout
    const vm = new VM({
      timeout: 2000, // 2 second execution limit
      sandbox: {},
    });

    // Extract the function from user code
    const fn = vm.run(`${code}; ${puzzle.functionName};`);

    if (typeof fn !== "function") {
      return res.status(400).json({
        passed: false,
        error: `Expected a function named '${puzzle.functionName}' but didn't find one.`,
      });
    }

    // Run each test case individually for detailed feedback
    testResults = puzzle.testCases.map((tc) => {
      try {
        const input = Array.isArray(tc.input) ? tc.input : [tc.input];
        const result = fn(...input);
        const expected = tc.expected;
        const pass =
          JSON.stringify(result) === JSON.stringify(expected);
        return { label: tc.label, input: tc.input, expected, result, pass };
      } catch (e) {
        return { label: tc.label, input: tc.input, expected: tc.expected, result: null, pass: false, error: e.message };
      }
    });

    passed = testResults.every((t) => t.pass);

  } catch (err) {
    errorMessage = err.message;
    passed = false;
  }

  // Log attempt to progress
  try {
    const progress = await Progress.findOne({ user: req.user._id });
    if (progress) {
      const floorRecord = progress.getFloor(puzzle.floor);
      floorRecord.attempts.push({ puzzleId, code, passed });
      progress.totalAttempts += 1;
      if (passed && !floorRecord.monsterDefeated) {
        floorRecord.monsterDefeated = true;
        floorRecord.defeatedAt = new Date();
        if (puzzle.floor === -1) {
          progress.currentFloor = 0;
          progress.gameCompleted = true;
          progress.gameCompletedAt = new Date();
        } else {
          progress.currentFloor = puzzle.floor + 1;
        }
      }
      await progress.save();
    }
  } catch (logErr) {
    // Don't fail the request over a logging error
    console.error("Progress log error:", logErr.message);
  }

  res.json({
    passed,
    testResults,
    error: errorMessage,
    message: passed
      ? "✅ All tests passed! Monster defeated!"
      : "❌ Some tests failed. Check your logic.",
  });
});

module.exports = router;
