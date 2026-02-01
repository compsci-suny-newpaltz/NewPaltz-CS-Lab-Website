const express = require("express");
const router = express.Router();
const studentResources = require('../models/studentResourcesModel');
const { verifySSO, requireAdmin } = require('../middleware/ssoAuth');

// Get all student resources
router.get("/", async (req, res) => {
    try {
        const rows = await studentResources.getAllStudentResources();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new student resource (admin only)
router.post("/", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await studentResources.addStudentResource(req.body);
        res.status(201).json({ message: "Student resource added successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a student resource (admin only)
router.delete("/:id", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await studentResources.removeStudentResource(req.params.id);
        res.json({ affectedRows: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Edit a student resource (admin only)
router.put("/:id", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await studentResources.editStudentResource(req.params.id, req.body);
        res.json({ affectedRows: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get student resource by ID
router.get("/:id", async (req, res) => {
    try {
        const resource = await studentResources.getResourceByID(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: "Student resource not found" });
        }
        res.json(resource); // Send the resource object
    } catch (err) {
        console.error("Error getting student resource by ID:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;