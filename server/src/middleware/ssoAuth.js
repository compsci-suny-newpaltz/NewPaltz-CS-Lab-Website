/**
 * SSO Authentication Middleware
 * Verifies np_access JWT cookies from hydra-saml-auth
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Load public key for JWT verification
let publicKey;
try {
  const keyPath = process.env.JWT_PUBLIC_KEY_PATH || '/home/infra/hydra-saml-auth/jwt-public.pem';
  publicKey = fs.readFileSync(keyPath, 'utf8');
  console.log('[SSO Auth] Loaded JWT public key from:', keyPath);
} catch (err) {
  console.error('[SSO Auth] Failed to load JWT public key:', err.message);
  console.error('[SSO Auth] SSO authentication will not work!');
}

// Admin whitelist from environment
const ADMIN_WHITELIST = (process.env.ADMIN_WHITELIST || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

if (ADMIN_WHITELIST.length > 0) {
  console.log('[SSO Auth] Admin whitelist:', ADMIN_WHITELIST.length, 'users');
}

/**
 * Verify SSO session from np_access cookie
 * Attaches user info to req.user if valid
 */
function verifySSO(req, res, next) {
  const token = req.cookies?.np_access;

  if (!token) {
    return res.status(401).json({
      error: 'Not authenticated',
      message: 'Please log in to continue',
      loginUrl: '/login?returnTo=' + encodeURIComponent(req.originalUrl)
    });
  }

  if (!publicKey) {
    console.error('[SSO Auth] No public key loaded - cannot verify token');
    return res.status(500).json({ error: 'Authentication service unavailable' });
  }

  try {
    const payload = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: process.env.JWT_ISSUER || 'https://hydra.newpaltz.edu'
    });

    const email = (payload.email || '').toLowerCase();
    const affiliation = (payload.affiliation || '').toLowerCase();

    // Determine admin status
    const isFaculty = affiliation === 'faculty';
    const isWhitelisted = ADMIN_WHITELIST.includes(email);
    const isAdmin = isFaculty || isWhitelisted;

    req.user = {
      email: payload.email,
      name: payload.display_name || payload.name || payload.email?.split('@')[0],
      given_name: payload.given_name,
      family_name: payload.family_name,
      affiliation: payload.affiliation,
      roles: payload.roles || [],
      groups: payload.groups || [],
      isAdmin,
      isFaculty,
      isStudent: affiliation === 'student',
      // Include original token claims for advanced use
      tokenClaims: {
        sub: payload.sub,
        iat: payload.iat,
        exp: payload.exp,
        aud: payload.aud,
        iss: payload.iss
      }
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Session expired',
        message: 'Your session has expired. Please log in again.',
        loginUrl: '/login?returnTo=' + encodeURIComponent(req.originalUrl)
      });
    }

    console.error('[SSO Auth] Token verification failed:', err.message);
    return res.status(401).json({
      error: 'Invalid session',
      message: 'Authentication failed. Please log in again.',
      loginUrl: '/login?returnTo=' + encodeURIComponent(req.originalUrl)
    });
  }
}

/**
 * Optional SSO verification - attaches user if token present, but allows anonymous access
 */
function optionalSSO(req, res, next) {
  const token = req.cookies?.np_access;

  if (!token || !publicKey) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: process.env.JWT_ISSUER || 'https://hydra.newpaltz.edu'
    });

    const email = (payload.email || '').toLowerCase();
    const affiliation = (payload.affiliation || '').toLowerCase();
    const isFaculty = affiliation === 'faculty';
    const isWhitelisted = ADMIN_WHITELIST.includes(email);

    req.user = {
      email: payload.email,
      name: payload.display_name || payload.name || payload.email?.split('@')[0],
      given_name: payload.given_name,
      family_name: payload.family_name,
      affiliation: payload.affiliation,
      roles: payload.roles || [],
      isAdmin: isFaculty || isWhitelisted,
      isFaculty,
      isStudent: affiliation === 'student'
    };
  } catch (err) {
    // Token invalid or expired - continue as anonymous
    req.user = null;
  }

  next();
}

/**
 * Require admin access (faculty or whitelisted user)
 * Must be used after verifySSO middleware
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Not authenticated',
      message: 'Please log in to continue'
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'This action requires faculty or administrator privileges'
    });
  }

  next();
}

/**
 * Require student access (any authenticated student)
 * Must be used after verifySSO middleware
 */
function requireStudent(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Not authenticated',
      message: 'Please log in to continue'
    });
  }

  if (!req.user.isStudent && !req.user.isAdmin) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'This action requires student access'
    });
  }

  next();
}

/**
 * Get current user info endpoint handler
 */
function getCurrentUser(req, res) {
  if (!req.user) {
    return res.json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    user: {
      email: req.user.email,
      name: req.user.name,
      given_name: req.user.given_name,
      family_name: req.user.family_name,
      affiliation: req.user.affiliation,
      isAdmin: req.user.isAdmin,
      isFaculty: req.user.isFaculty,
      isStudent: req.user.isStudent
    }
  });
}

module.exports = {
  verifySSO,
  optionalSSO,
  requireAdmin,
  requireStudent,
  getCurrentUser,
  ADMIN_WHITELIST
};
