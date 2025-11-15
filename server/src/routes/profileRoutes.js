const express = require("express");
const {
    getProfileById,
    updateProfile,
} = require("../models/profileModel");

const router = express.Router();

// Hardcoded for testing 

router.get("/:id", async (req, res) => {
    try {
        // Mock profile for testing
        const mockProfile = {
            id: req.params.id,
            name: "John Doe",
            email: "john.doe@example.com",

            role: "Student",
            bio: "This is a mock profile for testing."
        };

        res.json(mockProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

/*
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
*/

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