const pool = require('../config/db');

/**
 * Get all whitelisted admin emails
 */
async function getWhitelist() {
    const conn = await pool.getConnection();
    try {
        return await conn.query('SELECT * FROM AdminWhitelist ORDER BY email');
    } finally {
        conn.release();
    }
}

/**
 * Add email to whitelist
 */
async function addToWhitelist(email, addedBy, notes) {
    const conn = await pool.getConnection();
    try {
        return await conn.query(
            'INSERT INTO AdminWhitelist (email, added_by, notes) VALUES (?, ?, ?)',
            [email.toLowerCase(), addedBy, notes]
        );
    } finally {
        conn.release();
    }
}

/**
 * Remove email from whitelist
 */
async function removeFromWhitelist(email) {
    const conn = await pool.getConnection();
    try {
        return await conn.query(
            'DELETE FROM AdminWhitelist WHERE email = ?',
            [email.toLowerCase()]
        );
    } finally {
        conn.release();
    }
}

/**
 * Check if email is in whitelist
 */
async function isWhitelisted(email) {
    const conn = await pool.getConnection();
    try {
        const result = await conn.query(
            'SELECT 1 FROM AdminWhitelist WHERE email = ?',
            [email.toLowerCase()]
        );
        return result.length > 0;
    } finally {
        conn.release();
    }
}

module.exports = { getWhitelist, addToWhitelist, removeFromWhitelist, isWhitelisted };
