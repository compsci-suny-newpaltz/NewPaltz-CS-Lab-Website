const db = require("../config/db");

const getProfileById = async (userId) => {
    const [rows] = await db.query(
        "SELECT * FROM profiles WHERE user_id = ?",
        [userId]
    );
    return rows[0];
};

export const updateProfile = async (userId, data) => {
    const { firstName, lastName, bio } = data;
    await db.query(
        "UPDATE profiles SET first_name=?, last_name=?, bio=? WHERE user_id=?",
        [firstName, lastName, bio, userId]
    );
    return true;
};

module.exports = {
    getProfileById,
    updateProfile,
};