// PROBELM IN PROGRESS

const db = require("../config/db"); 

async function getProfileById(id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT id, name, email, role, bio, user_id
            FROM profiles
            WHERE id = ?
        `;

        db.query(query, [id], (err, results) => {
            if (err) return reject(err);

            if (results.length === 0) {
                return reject(new Error("Profile not found"));
            }

            resolve(results[0]);
        });
    });
}

async function updateProfile(id, profileData) {
    return new Promise((resolve, reject) => {
        // Filter fields that are allowed to be updated
        const allowedFields = ["name", "email", "role", "bio"];
        const updates = [];
        const values = [];

        for (const field of allowedFields) {
            if (profileData[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(profileData[field]);
            }
        }

        // No update fields provided
        if (updates.length === 0) {
            return reject(new Error("No valid fields provided to update"));
        }

        const query = `
            UPDATE profiles
            SET ${updates.join(", ")}
            WHERE id = ?
        `;

        values.push(id);

        db.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

module.exports = {
    getProfileById,
    updateProfile,
};
