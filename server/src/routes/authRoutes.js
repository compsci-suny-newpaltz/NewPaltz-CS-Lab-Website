/**
 * Authentication Routes Module
 * Handles admin user registration and login functionality
 * @module authRoutes
 */

// Import required dependencies
const express = require("express");
const bcrypt = require("bcryptjs");  // For password hashing
const jwt = require("jsonwebtoken");  // For creating tokens
const pool = require("../config/db");  // Database connection
require("dotenv").config();  // Load environment variables

const router = express.Router();

/**
 * Register a new admin user
 * @route POST /register
 * @param {string} req.body.username - The admin's username
 * @param {string} req.body.password - The admin's password
 * @returns {object} 201 - Admin registered successfully
 * @returns {object} 400 - Username already exists or missing fields
 * @returns {object} 500 - Server error
 */

/**
 * Authenticate an admin user
 * @route POST /login
 * @param {string} req.body.username - Admin's user name
 * @param {string} req.body.password - Admin's password
 * @returns {object} 200 - Login successful with JWT token
 * @returns {object} 400 - Missing username or password
 * @returns {object} 401 - Invalid credentials or user not found
 * @returns {object} 500 - Server error
 */
// Login route handler
router.post("/login", async (req, res) => {
    let conn;
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        conn = await pool.getConnection();

        // Query by username
        const results = await conn.query(
            "SELECT * FROM Admins WHERE user = ?",
            [username]
        );

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const userFound = results[0];

        // Ensure password hash exists
        if (!userFound.password_hash) {
            return res.status(500).json({ message: "Password hash missing for user" });
        }

        const passwordMatch = await bcrypt.compare(password, userFound.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Include role in the JWT
        const token = jwt.sign(
            {
                id: userFound.id,
                username: userFound.user,
                role: userFound.role  // <-- IMPORTANT
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Return token + role back to frontend
        res.json({
            token,
            role: userFound.role,
            message: "Login successful"
        });
        console.log("USER ROLE:", userFound.role);


    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        if (conn) conn.release();
    }
});

module.exports = router;
