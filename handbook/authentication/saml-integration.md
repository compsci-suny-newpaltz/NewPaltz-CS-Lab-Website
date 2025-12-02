# SAML Authentication Integration

This document explains the SAML (Security Assertion Markup Language) authentication system integrated with the New Paltz Hydra SSO.

## Overview

The website supports two authentication methods:
1. **SAML/SSO Authentication** - Primary method using New Paltz Hydra (Azure AD)
2. **Legacy JWT Authentication** - Secondary method using username/password

SAML authentication allows users to log in using their New Paltz credentials and automatically grants admin access to:
- All faculty and staff members
- Students on the admin whitelist

---

## How SAML Works

### Authentication Flow

1. User clicks "Sign in with New Paltz SSO" on the login page
2. User is redirected to Hydra: `https://hydra.newpaltz.edu/login`
3. User authenticates with New Paltz credentials (Azure AD)
4. Hydra sets an `np_access` cookie with a JWT token
5. User is redirected back to the website
6. Frontend checks `/api/saml/me` to verify authentication
7. If user is admin (faculty/staff/whitelist), they get full admin access

### SAML Claims

When a user authenticates, Hydra provides these claims:
- `email` - User's New Paltz email
- `display_name` - Full name
- `given_name` - First name
- `family_name` - Last name
- `affiliation` - Role (student, faculty, staff)
- `roles` - Array of roles

---

## Server-Side Components

### Middleware: `server/src/middleware/samlAuth.js`

Handles SAML token verification with Hydra.

```javascript
// Key functions:

// Verify token with Hydra /check endpoint
async function verifyWithHydra(token)

// Require any authenticated NP user
function requireNPAuth(req, res, next)

// Require student role
function requireStudent(req, res, next)

// Require admin (faculty/staff/whitelist)
function requireAdmin(req, res, next)

// Check if user is admin
async function isAdmin(userData)
```

**Admin determination logic:**
1. Check if affiliation is `faculty` or `staff` → Admin
2. Check if email is in AdminWhitelist table → Admin
3. Otherwise → Not admin

### Routes: `server/src/routes/samlAuthRoutes.js`

SAML authentication API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/saml/me` | GET | Get current user info from SAML session |
| `/api/saml/login-url` | GET | Get Hydra login URL with return path |
| `/api/saml/logout` | GET | Clear session and redirect to Hydra logout |
| `/api/saml/admin-whitelist` | GET | List all whitelisted emails (admin only) |
| `/api/saml/admin-whitelist` | POST | Add email to whitelist (admin only) |
| `/api/saml/admin-whitelist/:id` | DELETE | Remove email from whitelist (admin only) |

### Model: `server/src/models/adminWhitelistModel.js`

Database operations for the admin whitelist:

```javascript
// Get all whitelist entries
getAllWhitelist()

// Check if email is whitelisted
isWhitelisted(email)

// Add email to whitelist
addToWhitelist(email, addedBy, notes)

// Remove email from whitelist
removeFromWhitelist(id)
```

---

## Client-Side Components

### Context: `client/src/context/authContext.jsx`

Unified authentication context that handles both SAML and JWT auth.

```javascript
// Provided values:
{
    user,           // Current user object (from JWT or SAML)
    setUser,        // Update user manually
    samlUser,       // SAML-specific user data
    setSamlUser,    // Update SAML user
    loading,        // Auth initialization status
    logout,         // Logout function (handles both auth types)
    isAuthenticated,// Boolean: is user logged in
    isAdmin         // Boolean: does user have admin access
}
```

**Key behavior:**
- On mount, checks both JWT token and SAML session
- If SAML user is admin, automatically creates a `user` object with `role: 'admin'`
- Logout clears both JWT and SAML sessions

### Context: `client/src/context/samlAuthContext.jsx`

Standalone SAML context for student project submissions.

```javascript
// Provided values:
{
    samlUser,       // SAML user data
    loading,        // Auth check status
    isAuthenticated,// Boolean: has valid SAML session
    isAdmin,        // Boolean: is admin user
    loginUrl,       // Hydra login URL
    logout          // SAML logout function
}
```

---

## Admin Panel Access

The Admin Panel (`AdminPanel.jsx`) uses unified auth:

```javascript
// Check if user can access based on roles
const canAccess = (roles) => {
    if (samlUser?.isAdmin) return true; // SAML admins can access everything
    return user?.role && roles.includes(user.role);
};
```

SAML admins automatically have access to all admin panel sections.

---

## Login Page Behavior

The Login page (`Login.jsx`) handles unified auth:

1. **Auto-redirect**: If already authenticated as admin (SAML or JWT), redirects to `/admin-panel`
2. **Primary action**: "Sign in with New Paltz SSO" button
3. **Secondary action**: Legacy username/password form

```javascript
// Auto-redirect if already authenticated
useEffect(() => {
    if (!loading && (user || (samlUser && samlUser.isAdmin))) {
        navigate('/admin-panel');
    }
}, [user, samlUser, loading, navigate]);
```

---

## Database Schema

### AdminWhitelist Table

```sql
CREATE TABLE AdminWhitelist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    added_by VARCHAR(255),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(500)
);
```

### Initial Whitelist Entries

```sql
INSERT INTO AdminWhitelist (email, notes) VALUES
('gopeen1@newpaltz.edu', 'Student admin - initial setup'),
('mathewj10@newpaltz.edu', 'Student admin - initial setup'),
('alejilal1@newpaltz.edu', 'Student admin - initial setup'),
('slaterm2@newpaltz.edu', 'Student admin - initial setup'),
('manzim1@newpaltz.edu', 'Student admin - initial setup');
```

---

## Environment Variables

Add to `server/.env`:

```
HYDRA_BASE_URL=https://hydra.newpaltz.edu
CLIENT_URL=http://localhost:3000
```

Add to `client/.env`:

```
VITE_HYDRA_BASE_URL=https://hydra.newpaltz.edu
VITE_API_BASE_URL=http://localhost:5001
```

---

## Running the Migration

To set up SAML authentication, run the migration:

```bash
mysql -u <username> -p <database> < server/migrations/saml_integration.sql
```

This will:
1. Add SAML-related columns to StudentHighlightBlog
2. Create the AdminWhitelist table
3. Insert initial whitelist entries

---

## Testing SAML Auth Locally

1. Start the backend: `cd server && npm run dev`
2. Start the frontend: `cd client && npm run dev`
3. Go to `http://localhost:3000/admin-login`
4. Click "Sign in with New Paltz SSO"
5. Authenticate with your New Paltz credentials
6. If you're faculty/staff or on the whitelist, you'll be redirected to the admin panel

**Note:** SAML auth requires the Hydra server to be accessible and properly configured to accept your localhost as a valid return URL.

---

## Troubleshooting

### "Not authorized" after SSO login
- Check if your email is in the AdminWhitelist table
- Check if your affiliation is correctly set in Hydra
- Verify the `np_access` cookie is being set

### CORS errors
- Ensure `CLIENT_URL` in server `.env` matches your frontend URL
- Ensure `credentials: 'include'` is set on fetch requests

### Cookie not being sent
- Check that cookies are enabled in browser
- Verify `sameSite` and `secure` cookie settings match your environment
