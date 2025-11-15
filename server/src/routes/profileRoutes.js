const express = require("express");
const {
    getProfileById,
    updateProfile,
} = require("../models/profileModel");

const router = express.Router();

// Get a profile
router.get("/:id", async (req, res) => {
    try {
        const profile = await getProfileById(req.params.id);
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// Update a profile
router.put("/:id", async (req, res) => {
    try {
        await updateProfile(req.params.id, req.body);
        res.json({ message: "Profile updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

module.exports = router;