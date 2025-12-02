const pool = require('../config/db');

const HYDRA_BASE_URL = process.env.HYDRA_BASE_URL || 'https://hydra.newpaltz.edu';

/**
 * Get admin whitelist from database
 */
async function getAdminWhitelist() {
    const conn = await pool.getConnection();
    try {
        const rows = await conn.query('SELECT email FROM AdminWhitelist');
        return rows.map(r => r.email.toLowerCase());
    } catch (err) {
        console.error('Error fetching whitelist:', err);
        return [];
    } finally {
        conn.release();
    }
}

/**
 * Verify SAML token with Hydra
 */
async function verifyWithHydra(token) {
    if (!token) return { ok: false, status: 401 };

    try {
        const response = await fetch(`${HYDRA_BASE_URL}/check`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) return { ok: false, status: response.status };

        const data = await response.json();
        return { ok: data.active, status: 200, data };
    } catch (error) {
        console.error('Hydra verification error:', error);
        return { ok: false, status: 500 };
    }
}

/**
 * Middleware: Require any authenticated NP user
 */
async function requireNPAuth(req, res, next) {
    try {
        const token = req.cookies?.np_access;

        if (!token) {
            return res.status(401).json({
                message: 'Authentication required',
                loginUrl: `${HYDRA_BASE_URL}/login?returnTo=${encodeURIComponent(req.originalUrl)}`
            });
        }

        const result = await verifyWithHydra(token);

        if (!result.ok || !result.data?.active) {
            return res.status(401).json({
                message: 'Invalid or expired session',
                loginUrl: `${HYDRA_BASE_URL}/login?returnTo=${encodeURIComponent(req.originalUrl)}`
            });
        }

        // Attach user data to request
        req.samlUser = result.data;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Authentication error' });
    }
}

/**
 * Middleware: Require student role
 */
async function requireStudent(req, res, next) {
    if (!req.samlUser) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const roles = (req.samlUser.roles || []).map(r => r.toLowerCase());
    const affiliation = (req.samlUser.affiliation || '').toLowerCase();

    // Students can submit projects, but also allow faculty/staff
    if (affiliation === 'student' || roles.includes('student') ||
        affiliation === 'faculty' || affiliation === 'staff' ||
        roles.includes('faculty') || roles.includes('staff')) {
        return next();
    }

    return res.status(403).json({ message: 'New Paltz student or staff access required' });
}

/**
 * Middleware: Require staff/admin role
 */
async function requireAdmin(req, res, next) {
    if (!req.samlUser) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const email = (req.samlUser.email || '').toLowerCase();
    const roles = (req.samlUser.roles || []).map(r => r.toLowerCase());
    const affiliation = (req.samlUser.affiliation || '').toLowerCase();

    // Check whitelist first
    const whitelist = await getAdminWhitelist();
    if (whitelist.includes(email)) {
        req.samlUser.isWhitelistAdmin = true;
        return next();
    }

    // Check if staff/faculty
    if (affiliation === 'faculty' || affiliation === 'staff' ||
        roles.includes('faculty') || roles.includes('staff')) {
        return next();
    }

    return res.status(403).json({ message: 'Admin access required' });
}

/**
 * Check if user is admin (helper function)
 */
async function isAdmin(samlUser) {
    if (!samlUser) return false;

    const email = (samlUser.email || '').toLowerCase();
    const roles = (samlUser.roles || []).map(r => r.toLowerCase());
    const affiliation = (samlUser.affiliation || '').toLowerCase();

    const whitelist = await getAdminWhitelist();

    return whitelist.includes(email) ||
        affiliation === 'faculty' ||
        affiliation === 'staff' ||
        roles.includes('faculty') ||
        roles.includes('staff');
}

/**
 * Check whitelist only (sync helper)
 */
async function isWhitelisted(email) {
    const whitelist = await getAdminWhitelist();
    return whitelist.includes(email.toLowerCase());
}

module.exports = {
    verifyWithHydra,
    requireNPAuth,
    requireStudent,
    requireAdmin,
    isAdmin,
    isWhitelisted,
    getAdminWhitelist,
    HYDRA_BASE_URL
};
