const pool = require('../config/db');

/*
CREATE TABLE IF NOT EXISTS Events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(255),
    flyer_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Admins(id)
);
*/

/**
 * Retrieves all events from the database
 * @returns {Promise<Array>} Array of event objects
 */
async function getAllEvents() {
    const conn = await pool.getConnection();
    try {
        const rows = await conn.query("SELECT * FROM Events ORDER BY start_time ASC");
        return rows;
    } finally {
        conn.release();
    }
}

/**
 * Adds a new event to the database
 * @param {Object} eventData - Event data containing title, description, start_time, end_time, location, flyer_url
 * @returns {Promise<number>} The ID of the newly created event
 */
async function addEvent(eventData) {
    const { admin_id, title, description, start_time, end_time, location, flyer_url } = eventData;

    const conn = await pool.getConnection();
    try {
        const result = await conn.query(
            "INSERT INTO Events (admin_id, title, description, start_time, end_time, location, flyer_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [admin_id, title, description, start_time, end_time, location, flyer_url]
        );
        return result.insertId;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error('Failed to add event');
    } finally {
        conn.release();
    }
}

/**
 * Deletes an event from the database by ID
 * @param {number} id - Event ID
 * @returns {Promise<number>} Number of affected rows
 */
async function deleteEvent(id) {
    const conn = await pool.getConnection();
    try {
        const result = await conn.query("DELETE FROM Events WHERE id = ?", [id]);
        return result.affectedRows;
    } finally {
        conn.release();
    }
}

/**
 * Retrieves all events created by a specific admin
 * @param {number} adminId - Admin ID
 * @returns {Promise<Array>} Array of event objects
 */
async function getEventsByAdminId(adminId) {
    const conn = await pool.getConnection();
    try {
        const rows = await conn.query(
            "SELECT * FROM Events WHERE admin_id = ? ORDER BY start_time ASC",
            [adminId]
        );
        return rows;
    } finally {
        conn.release();
    }
}

module.exports = {
    getAllEvents,
    addEvent,
    deleteEvent,
    getEventsByAdminId
};
