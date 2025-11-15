const db = require("../config/db");

async function getProfileById(id) {
    let conn;
    try {
        conn = await db.getConnection();
        const rows = await conn.query("SELECT * FROM profiles WHERE id = ?", [id]);
        return rows[0]; // Return first row
    } catch (err) {
        console.error("Error fetching profile:", err);
        throw err;
    } finally {

if (conn) conn.release();
    }
}

async function updateProfile(id, data) {
    let conn;
    try {
        conn = await db.getConnection();
        const { name, email, role, bio } = data;
        await conn.query(
            "UPDATE profiles SET name = ?, email = ?, role = ?, bio = ? WHERE id = ?",

[name, email, role, bio, id]
        );
    } catch (err) {
        console.error("Error updating profile:", err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = { getProfileById, updateProfile };

