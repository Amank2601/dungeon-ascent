// backend/routes/judge.js
// Uses Piston API — completely free, no API key, no signup
// https://github.com/engineer-man/piston

const express = require("express");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const LANG_VERSIONS = {
  python:     { language: "python",     version: "3.10.0",  filename: "solution.py"  },
  java:       { language: "java",       version: "15.0.2",  filename: "Main.java"    },
  cpp:        { language: "cpp",        version: "10.2.0",  filename: "solution.cpp" },
  javascript: { language: "javascript", version: "18.15.0", filename: "solution.js"  },
};

// POST /api/judge/run
// Body: { code, language }
router.post("/run", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "code and language are required" });
  }

  const langConfig = LANG_VERSIONS[language];
  if (!langConfig) {
    return res.status(400).json({ error: `Unsupported language: ${language}` });
  }

  try {
    const response = await fetch(PISTON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: langConfig.language,
        version:  langConfig.version,
        files: [
          {
            name:    langConfig.filename,
            content: code,
          },
        ],
        stdin:           "",
        args:            [],
        compile_timeout: 10000,
        run_timeout:     5000,
        compile_memory_limit: -1,
        run_memory_limit:     -1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: `Piston error: ${errText}` });
    }

    const data = await response.json();

    res.json({
      stdout:  data.run?.stdout  || "",
      stderr:  data.run?.stderr  || data.compile?.stderr || "",
      status:  data.run?.code === 0 ? "Accepted" : "Error",
      code:    data.run?.code,
      signal:  data.run?.signal,
    });

  } catch (err) {
    console.error("Piston error:", err.message);
    res.status(500).json({ error: err.message, useFallback: true });
  }
});

// GET /api/judge/runtimes — lists all available Piston runtimes
router.get("/runtimes", async (req, res) => {
  try {
    const r = await fetch("https://emkc.org/api/v2/piston/runtimes");
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;