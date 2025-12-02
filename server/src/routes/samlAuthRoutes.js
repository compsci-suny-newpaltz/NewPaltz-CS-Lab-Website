const express = require('express');
const router = express.Router();
const { verifyWithHydra, isAdmin, isWhitelisted, requireNPAuth, requireAdmin, HYDRA_BASE_URL } = require('../middleware/samlAuth');
const adminWhitelist = require('../models/adminWhitelistModel');

/**
 * GET /saml/me - Get current user info from SAML token
 */
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies?.np_access;

        if (!token) {
            return res.json({ authenticated: false });
        }

        const result = await verifyWithHydra(token);

        if (!result.ok || !result.data?.active) {
            return res.json({ authenticated: false });
        }

        const user = result.data;
        const adminStatus = await isAdmin(user);
        const whitelistStatus = await isWhitelisted(user.email || '');

        return res.json({
            authenticated: true,
            user: {
                email: user.email,
                name: user.display_name || `${user.given_name || ''} ${user.family_name || ''}`.trim(),
                given_name: user.given_name,
                family_name: user.family_name,
                affiliation: user.affiliation,
                roles: user.roles,
                isAdmin: adminStatus,
                isWhitelistAdmin: whitelistStatus
            }
        });
    } catch (error) {
        console.error('SAML me error:', error);
        res.status(500).json({ message: 'Error fetching user info' });
    }
});

/**
 * GET /saml/login-url - Get login URL with return path
 */
router.get('/login-url', (req, res) => {
    const returnTo = req.query.returnTo || '/';
    const loginUrl = `${HYDRA_BASE_URL}/login?returnTo=${encodeURIComponent(returnTo)}`;
    res.json({ loginUrl });
});

/**
 * GET /saml/logout - Clear session and redirect to Hydra logout
 */
router.get('/logout', (req, res) => {
    res.clearCookie('np_access');
    res.redirect(`${HYDRA_BASE_URL}/logout`);
});

/**
 * GET /saml/admin-whitelist - Get whitelist entries (admin only)
 */
router.get('/admin-whitelist', requireNPAuth, requireAdmin, async (req, res) => {
    try {
        const whitelist = await adminWhitelist.getWhitelist();
        res.json(whitelist);
    } catch (error) {
        console.error('Error getting whitelist:', error);
        res.status(500).json({ message: 'Error fetching whitelist' });
    }
});

/**
 * POST /saml/admin-whitelist - Add email to whitelist (admin only)
 */
router.post('/admin-whitelist', requireNPAuth, requireAdmin, async (req, res) => {
    try {
        const { email, notes } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const addedBy = req.samlUser.email;
        await adminWhitelist.addToWhitelist(email, addedBy, notes);
        res.status(201).json({ message: 'Email added to whitelist' });
    } catch (error) {
        console.error('Error adding to whitelist:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already in whitelist' });
        }
        res.status(500).json({ message: 'Error adding to whitelist' });
    }
});

/**
 * DELETE /saml/admin-whitelist/:email - Remove email from whitelist (admin only)
 */
router.delete('/admin-whitelist/:email', requireNPAuth, requireAdmin, async (req, res) => {
    try {
        const result = await adminWhitelist.removeFromWhitelist(req.params.email);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Email not found in whitelist' });
        }
        res.json({ message: 'Email removed from whitelist' });
    } catch (error) {
        console.error('Error removing from whitelist:', error);
        res.status(500).json({ message: 'Error removing from whitelist' });
    }
});

module.exports = router;
