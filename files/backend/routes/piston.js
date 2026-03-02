const express = require("express");
const router = express.Router();

router.post("/execute", async (req, res) => {
  try {
    const response = await fetch("http://localhost:2000/api/v2/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).send(text);
    }

    res.send(text);
  } catch (err) {
    console.error("Piston proxy error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;