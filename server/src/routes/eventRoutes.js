const express = require('express');
const router = express.Router();
const eventsModel = require('../models/eventsModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Middleware to validate required fields for POST
function validateEvent(req, res, next) {
    const { admin_id, title, start_time, end_time } = req.body;
    if (!admin_id || !title || !start_time || !end_time) {
        return res.status(400).json({ message: 'admin_id, title, start_time, and end_time are required' });
    }
    next();
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// Optional: accept only image files
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
});

// Serve uploaded files statically
router.use('/uploads', express.static(uploadsDir));

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await eventsModel.getAllEvents();
        res.json(events);
    } catch (err) {
        console.error('Error getting events:', err);
        res.status(500).json({ message: 'Failed to fetch events' });
    }
});

// Add a new event with optional flyer
router.post('/', validateEvent, upload.single('flyer'), async (req, res) => {
    try {
        const { admin_id, title, description, start_time, end_time, location } = req.body;

        // Use uploaded flyer if present, otherwise use default noFlyer
        const flyer_url = req.file ? `/uploads/${req.file.filename}` : `/uploads/noFlyer.jpg`;

        const insertId = await eventsModel.addEvent({
            admin_id: Number(admin_id),
            title,
            description,
            start_time,
            end_time,
            location,
            flyer_url,
        });

        res.status(201).json({ message: 'Event added successfully', id: insertId });
    } catch (err) {
        console.error('Error adding event:', err);
        res.status(500).json({ message: 'Failed to add event' });
    }
});


// Delete an event by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const affectedRows = await eventsModel.deleteEvent(id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully', affectedRows });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ message: 'Failed to delete event' });
    }
});

// Get events by admin ID
router.get('/admin/:adminId', async (req, res) => {
    try {
        const adminId = Number(req.params.adminId);
        const events = await eventsModel.getEventsByAdminId(adminId);
        res.json(events);
    } catch (err) {
        console.error('Error getting events by admin ID:', err);
        res.status(500).json({ message: 'Failed to fetch events for this admin' });
    }
});

module.exports = router;
