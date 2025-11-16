const express = require('express');
const router = express.Router();
const eventsModel = require('../models/eventsModel');

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await eventsModel.getAllEvents();
        res.json(events);
    } catch (err) {
        console.error('Error getting events:', err);
        res.status(500).json({ message: err.message });
    }
});

// Add a new event
router.post('/', async (req, res) => {
    try {
        console.log('req.body:', req.body);
        await eventsModel.addEvent(req.body);
        res.status(201).json({ message: 'Event added successfully' });
    } catch (err) {
        console.error('Error adding event:', err);
        res.status(500).json({ message: err.message });
    }
});

// Delete an event by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await eventsModel.deleteEvent(req.params.id);
        res.json({ affectedRows: result });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get events by admin ID
router.get('/admin/:adminId', async (req, res) => {
    try {
        const events = await eventsModel.getEventsByAdminId(req.params.adminId);
        res.json(events);
    } catch (err) {
        console.error('Error getting events by admin ID:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;