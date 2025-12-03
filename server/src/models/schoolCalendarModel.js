const pool = require('../config/db');

// School Calendar CRUD

// Get all calendars
async function getAllCalendars() {
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM SchoolCalendar ORDER BY id ASC");
    conn.release();
    return rows;
}

// Add calendar (now supports isDefault)
async function addCalendar(data) {
    const conn = await pool.getConnection();
    try {
        // Normalize isDefault safely
        const isDefault = data.isDefault ? 1 : 0;

        // If adding a default calendar, remove default from others
        if (isDefault === 1) {
            await conn.query("UPDATE SchoolCalendar SET isDefault = 0");
        }

        const result = await conn.query(
            `INSERT INTO SchoolCalendar 
            (FallStart, FallEnd, WinterStart, WinterEnd, SpringStart, SpringEnd, SummerStart, SummerEnd, isDefault)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.FallStart,
                data.FallEnd,
                data.WinterStart,
                data.WinterEnd,
                data.SpringStart,
                data.SpringEnd,
                data.SummerStart,
                data.SummerEnd,
                isDefault
            ]
        );

        return result.insertId;
    } finally {
        conn.release();
    }
}


// Get calendar by ID
async function getCalendarById(id) {
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM SchoolCalendar WHERE id = ?", [id]);
    conn.release();
    return rows.length > 0 ? rows[0] : null;
}

// Edit calendar (includes isDefault)
async function editCalendar(id, data) {
    const conn = await pool.getConnection();
    try {
        // Get the current db value
        const [rows] = await conn.query(
            "SELECT isDefault FROM SchoolCalendar WHERE id = ?",
            [id]
        );

        const previousDefault = rows[0]?.isDefault ?? 0;
        const newDefault = data.isDefault ? 1 : 0;

        // ONLY unset others if default actually changed
        if (newDefault === 1 && previousDefault === 0) {
            await conn.query("UPDATE SchoolCalendar SET isDefault = 0");
        }

        const query = `
            UPDATE SchoolCalendar
            SET FallStart = ?, FallEnd = ?, 
                WinterStart = ?, WinterEnd = ?, 
                SpringStart = ?, SpringEnd = ?, 
                SummerStart = ?, SummerEnd = ?,
                isDefault = ?
            WHERE id = ?
        `;

        const result = await conn.query(query, [
            data.FallStart,
            data.FallEnd,
            data.WinterStart,
            data.WinterEnd,
            data.SpringStart,
            data.SpringEnd,
            data.SummerStart,
            data.SummerEnd,
            newDefault,
            id
        ]);

        return result.affectedRows;
    } finally {
        conn.release();
    }
}



// Delete calendar
async function removeCalendar(id) {
    const conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM SchoolCalendar WHERE id = ?", [id]);
    conn.release();
    return result.affectedRows;
}


//No School Days CRUD

async function getNoSchoolDays(calendarId) {
    const conn = await pool.getConnection();
    const rows = await conn.query(
        "SELECT * FROM NoSchoolDays WHERE CalendarId = ?",
        [calendarId]
    );
    conn.release();

    return rows.map(r => ({
        ...r,
        Day: r.Day.toISOString().split("T")[0] 
    }));
}


async function addNoSchoolDay(calendarId, date) {
    const conn = await pool.getConnection();
    try {
        const result = await conn.query(
            "INSERT INTO NoSchoolDays (CalendarId, Day) VALUES (?, ?)",
            [calendarId, date]
        );

        // result.insertId is BigInt → convert here
        return Number(result.insertId);
    } finally {
        conn.release();
    }
}




async function removeNoSchoolDay(id) {
    const conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM NoSchoolDays WHERE id = ?", [id]);
    conn.release();
    return result.affectedRows;
}


//Faculty-Semester Assignments CRUD

async function getFacultyForSemester(calendarId, semester) {
    const conn = await pool.getConnection();
    const rows = await conn.query(
        `SELECT 
            fs.id AS EntryId,
             fs.CalendarId,
             fs.FacultyId,
            fs.Semester,
             f.id AS FacultyIdActual,
             f.name
            FROM FacultySemesters fs
            JOIN Faculty f ON fs.FacultyId = f.id
            WHERE fs.CalendarId = ? AND fs.Semester = ?`,
        [calendarId, semester]
    );
    conn.release();
    return rows;
}


async function addFacultyToSemester(calendarId, facultyId, semester) {
    const conn = await pool.getConnection();
    const result = await conn.query(
        "INSERT INTO FacultySemesters (CalendarId, FacultyId, Semester) VALUES (?, ?, ?)",
        [calendarId, facultyId, semester]
    );
    conn.release();

    console.log("INSERT RESULT:", result);
    return Number(result.insertId);
}

async function removeFacultyFromSemester(id) {
    const conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM FacultySemesters WHERE id = ?", [id]);
    conn.release();
    return result.affectedRows;
}

module.exports = {
    getAllCalendars,
    addCalendar,
    getCalendarById,
    editCalendar,
    removeCalendar,

    getNoSchoolDays,
    addNoSchoolDay,
    removeNoSchoolDay,

    getFacultyForSemester,
    addFacultyToSemester,
    removeFacultyFromSemester
};
