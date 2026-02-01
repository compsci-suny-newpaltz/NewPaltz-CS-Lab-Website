const express = require("express");
const router = express.Router();
const compExam = require('../models/compExamModel');
const { verifySSO, requireAdmin } = require('../middleware/ssoAuth');

// Get comp exam settings (public)
router.get("/", async (req, res) => {
    try {
        const settings = await compExam.getCompExamSettings();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update comp exam settings (admin only)
router.put("/", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await compExam.updateCompExamSettings(req.body);
        res.json({ affectedRows: result, message: "Settings updated successfully" });
    } catch (err) {
        console.error("Error updating comp exam settings:", err);
        res.status(500).json({ message: "Failed to update settings", error: err.message });
    }
});

module.exports = router;
