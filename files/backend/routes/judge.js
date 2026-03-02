// backend/routes/judge.js
const express = require("express");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

const JUDGE0_BASE = "https://judge0-ce.p.rapidapi.com";

// ─── POST /api/judge/run ──────────────────────────────────────────────────────
// Body: { code, languageId, language }
router.post("/run", async (req, res) => {
  const { code, languageId } = req.body;

  if (!code || !languageId) {
    return res.status(400).json({ error: "code and languageId are required" });
  }

  const apiKey = process.env.JUDGE0_API_KEY;

  // ── No API key: return a helpful error ──────────────────────────────────────
  if (!apiKey || apiKey === "your_judge0_api_key_here") {
    return res.status(503).json({
      error: "JUDGE0_NOT_CONFIGURED",
      message: "Judge0 API key not set. Add JUDGE0_API_KEY to your backend .env file. Get a free key at https://rapidapi.com/judge0-official/api/judge0-ce",
      useFallback: true,
    });
  }

  try {
    // Step 1: Submit code
    const submitRes = await fetch(`${JUDGE0_BASE}/submissions?base64_encoded=false&wait=false`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: "",
        cpu_time_limit: 5,
        memory_limit: 128000,
      }),
    });

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      return res.status(500).json({ error: `Judge0 submission failed: ${errText}` });
    }

    const { token } = await submitRes.json();
    if (!token) return res.status(500).json({ error: "No token from Judge0" });

    // Step 2: Poll for result (max 10 attempts, 1s apart)
    let result = null;
    for (let i = 0; i < 10; i++) {
      await sleep(1000);
      const pollRes = await fetch(
        `${JUDGE0_BASE}/submissions/${token}?base64_encoded=false`,
        {
          headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );
      const pollData = await pollRes.json();
      // Status IDs: 1=In Queue, 2=Processing, 3+=Done
      if (pollData.status?.id >= 3) {
        result = pollData;
        break;
      }
    }

    if (!result) {
      return res.status(408).json({ error: "Judge0 timed out waiting for result" });
    }

    // Status 3 = Accepted, others = various errors
    res.json({
      stdout:   result.stdout  || "",
      stderr:   result.stderr  || result.compile_output || "",
      status:   result.status?.description || "Unknown",
      statusId: result.status?.id,
      time:     result.time,
      memory:   result.memory,
    });

  } catch (err) {
    console.error("Judge0 error:", err.message);
    res.status(500).json({ error: err.message, useFallback: true });
  }
});

// ─── GET /api/judge/languages ─────────────────────────────────────────────────
// Returns supported language list from Judge0
router.get("/languages", async (req, res) => {
  const apiKey = process.env.JUDGE0_API_KEY;
  if (!apiKey || apiKey === "your_judge0_api_key_here") {
    return res.json({ configured: false, message: "Judge0 not configured" });
  }
  try {
    const r = await fetch(`${JUDGE0_BASE}/languages`, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    });
    const data = await r.json();
    res.json({ configured: true, languages: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = router;
