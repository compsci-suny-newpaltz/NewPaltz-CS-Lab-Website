const express = require("express");
const router = express.Router();
const faculty = require('../models/facultyModel');
const { verifySSO, requireAdmin } = require('../middleware/ssoAuth');

router.get("/", async (req, res) => {
    try {
        const rows = await faculty.getAllFaculty();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add faculty (admin only)
router.post("/", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await faculty.addFaculty(req.body);
        res.status(201).json({ id: result.toString(), message: "Faculty added successfully" });
    } catch (err) {
        console.error("Error adding faculty:", err);
        res.status(500).json({ message: err.message });
    }
});

//get faculty by id
router.get("/:id", async (req, res) => {
    try {
        const row = await faculty.getFacultyById(req.params.id);
        res.json(row);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Edit all columns (admin only)
router.put("/:id", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await faculty.editFaculty(req.params.id, req.body);
        res.json({ affectedRows: result, message: "Faculty Member updated successfully" });
    } catch (err) {
        console.error("Cannot Update Faculty Member", err)
        res.status(500).json({ message: err.message });
    }
});

// Delete faculty (admin only)
router.delete("/:id", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await faculty.removeFaculty(req.params.id);
        res.json({ affectedRows: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update only office hours (admin only)
router.patch("/:id/office-hours", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await faculty.changeOnlyFacultyOfficeHours(req.params.id, req.body.office_hours);
        res.json({ affectedRows: result, message: "Faculty Member's office hours updated successfully" });
    } catch (err) {
        console.error("Cannot Update Faculty Member's office hours", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

