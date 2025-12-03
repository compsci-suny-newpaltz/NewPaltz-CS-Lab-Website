const express = require("express");
const router = express.Router();
const calendar = require("../models/schoolCalendarModel");
const db = require("../config/db");

// get all calendars
router.get("/", async (req, res) => {
    try {
        const rows = await calendar.getAllCalendars();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// add a new calendar
router.post("/", async (req, res) => {
    try {
        const id = await calendar.addCalendar(req.body);
        res.status(201).json({ id, message: "Calendar added successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get calendar by id
router.get("/:id", async (req, res) => {
    try {
        const row = await calendar.getCalendarById(req.params.id);
        res.json(row);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// edit calendar
router.put("/:id", async (req, res) => {
    try {
        const affectedRows = await calendar.editCalendar(req.params.id, req.body);
        res.json({ affectedRows, message: "Calendar updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// delete calendar
router.delete("/:id", async (req, res) => {
    try {
        const affectedRows = await calendar.removeCalendar(req.params.id);
        res.json({ affectedRows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// No School Days CRUD

// get no school days for a calendar
router.get("/:id/no-school", async (req, res) => {
    try {
        const rows = await calendar.getNoSchoolDays(req.params.id);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post("/:id/no-school", async (req, res) => {
    try {
        const insertId = await calendar.addNoSchoolDay(req.params.id, req.body.Day);

        // Convert BigInt → Number
        const safeId = Number(insertId);

        res.json({ id: safeId, message: "No school day added!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// delete a no school day
router.delete("/no-school/:dayId", async (req, res) => {
    try {
        const affectedRows = await calendar.removeNoSchoolDay(req.params.dayId);
        res.json({ affectedRows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Faculty-Semester Assignments CRUD

// get faculty for a semester
router.get("/:id/semester/:semester", async (req, res) => {
    try {
        const rows = await calendar.getFacultyForSemester(
            req.params.id,
            req.params.semester
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// assign faculty to a semester
router.post("/:id/semester", async (req, res) => {
    try {
        const insertId = await calendar.addFacultyToSemester(
            req.params.id,
            req.body.FacultyId,
            req.body.Semester
        );
        res.json({ id: insertId, message: "Faculty assigned to semester!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// remove faculty from semester
router.delete("/semester/:entryId", async (req, res) => {
    try {
        const affectedRows = await calendar.removeFacultyFromSemester(req.params.entryId);
        res.json({ affectedRows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/:id/set-default", async (req, res) => {
    const { id } = req.params;
    console.log("Setting default calendar to ID:", id);

    try {
        // First remove default from all calendars
        await db.query("UPDATE SchoolCalendar SET isDefault = 0");

        // Then set selected calendar to default
        await db.query("UPDATE SchoolCalendar SET isDefault = 1 WHERE id = ?", [id]);

        res.json({ message: "Default calendar updated", id });
    } catch (error) {
        console.error("Error setting default calendar:", error);
        res.status(500).json({ error: "Failed to set default calendar" });
    }
});


module.exports = router;
