const express = require("express");
const router = express.Router();

/*
  This mock simulates the behavior of the real adminProxy.js
  but does NOT contact Hydra or require any server tokens.
  It allows the frontend to work locally without errors.
*/

// Matches the same endpoint
router.post("/admin/createUser", async (req, res) => {
  const body = req.body;

  // simulate the real validation behavior
  if (!body || typeof body.action !== "string") {
    return res.status(400).json({ error: "invalid input" });
  }

  if (body.action !== "testHello" && body.action !== "createUser") {
    return res.status(400).json({ error: "unknown action" });
  }

  if (body.action === "createUser") {
    if (!body.id && !(body.email && body.nId)) {
      return res.status(400).json({ error: "missing required fields" });
    }
  }

  // Mock response consistent with the real API shape
  return res.json({
    mock: true,
    stdout: `MOCK RESPONSE: action="${body.action}" processed locally`,
    input: body,
  });
});

module.exports = router;
