# Admin Whitelist Model

This file handles database operations for the admin whitelist feature, which allows specific email addresses to have admin access even if they're not faculty or staff.

## File: `server/src/models/adminWhitelistModel.js`

```javascript
const pool = require('../config/db');

const adminWhitelistModel = {
    // Get all whitelist entries
    async getAllWhitelist() {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                'SELECT * FROM AdminWhitelist ORDER BY added_at DESC'
            );
            return rows;
        } finally {
            conn.release();
        }
    },

    // Check if an email is whitelisted
    async isWhitelisted(email) {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                'SELECT * FROM AdminWhitelist WHERE email = ?',
                [email.toLowerCase()]
            );
            return rows.length > 0;
        } finally {
            conn.release();
        }
    },

    // Add email to whitelist
    async addToWhitelist(email, addedBy, notes = '') {
        const conn = await pool.getConnection();
        try {
            const result = await conn.query(
                'INSERT INTO AdminWhitelist (email, added_by, notes) VALUES (?, ?, ?)',
                [email.toLowerCase(), addedBy, notes]
            );
            return result;
        } finally {
            conn.release();
        }
    },

    // Remove email from whitelist
    async removeFromWhitelist(id) {
        const conn = await pool.getConnection();
        try {
            const result = await conn.query(
                'DELETE FROM AdminWhitelist WHERE id = ?',
                [id]
            );
            return result;
        } finally {
            conn.release();
        }
    }
};

module.exports = adminWhitelistModel;
```

---

## What This Does

### **1. Get All Whitelist Entries**
```javascript
async getAllWhitelist()
```
Returns all whitelisted emails, sorted by most recently added.

**Returns:** Array of whitelist entries with `id`, `email`, `added_by`, `added_at`, `notes`

---

### **2. Check If Email Is Whitelisted**
```javascript
async isWhitelisted(email)
```
Checks if a specific email address has admin access.

**Parameters:**
- `email` - Email address to check (case-insensitive)

**Returns:** `true` if email is whitelisted, `false` otherwise

**Usage in SAML middleware:**
```javascript
const isOnWhitelist = await adminWhitelistModel.isWhitelisted(userData.email);
if (isOnWhitelist) {
    // Grant admin access
}
```

---

### **3. Add Email to Whitelist**
```javascript
async addToWhitelist(email, addedBy, notes = '')
```
Adds a new email to the admin whitelist.

**Parameters:**
- `email` - Email address to whitelist
- `addedBy` - Email of admin who added this entry
- `notes` - Optional notes about why this user was added

**Example:**
```javascript
await adminWhitelistModel.addToWhitelist(
    'student@newpaltz.edu',
    'admin@newpaltz.edu',
    'Lab assistant - needs admin access'
);
```

---

### **4. Remove Email from Whitelist**
```javascript
async removeFromWhitelist(id)
```
Removes a whitelist entry by ID.

**Parameters:**
- `id` - Database ID of the whitelist entry

---

## Database Schema

```sql
CREATE TABLE AdminWhitelist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    added_by VARCHAR(255),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(500)
);

-- Index for faster lookups
CREATE INDEX idx_whitelist_email ON AdminWhitelist(email);
```

---

## API Endpoints

The whitelist is managed through these endpoints in `samlAuthRoutes.js`:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/saml/admin-whitelist` | List all whitelisted emails | Admin |
| POST | `/api/saml/admin-whitelist` | Add email to whitelist | Admin |
| DELETE | `/api/saml/admin-whitelist/:id` | Remove email from whitelist | Admin |

### Example: Add to Whitelist
```javascript
// POST /api/saml/admin-whitelist
{
    "email": "student@newpaltz.edu",
    "notes": "Lab assistant"
}
```

### Example: List Whitelist
```javascript
// GET /api/saml/admin-whitelist
// Response:
[
    {
        "id": 1,
        "email": "gopeen1@newpaltz.edu",
        "added_by": null,
        "added_at": "2024-01-15T10:30:00.000Z",
        "notes": "Student admin - initial setup"
    },
    // ...
]
```

---

## Initial Whitelist Entries

The migration script includes these initial entries:

```sql
INSERT IGNORE INTO AdminWhitelist (email, notes) VALUES
('gopeen1@newpaltz.edu', 'Student admin - initial setup'),
('mathewj10@newpaltz.edu', 'Student admin - initial setup'),
('alejilal1@newpaltz.edu', 'Student admin - initial setup'),
('slaterm2@newpaltz.edu', 'Student admin - initial setup'),
('manzim1@newpaltz.edu', 'Student admin - initial setup');
```

---

## How Admin Access Is Determined

The SAML middleware (`samlAuth.js`) determines admin status in this order:

1. **Affiliation Check** - Is user faculty or staff?
   ```javascript
   const affiliation = userData.affiliation?.toLowerCase();
   if (affiliation === 'faculty' || affiliation === 'staff') {
       return true;
   }
   ```

2. **Whitelist Check** - Is email in AdminWhitelist table?
   ```javascript
   const isOnWhitelist = await adminWhitelistModel.isWhitelisted(userData.email);
   return isOnWhitelist;
   ```

This allows students or other non-faculty users to have admin access when needed.

---

## Related Files

- `server/src/middleware/samlAuth.js` - Uses whitelist for admin determination
- `server/src/routes/samlAuthRoutes.js` - API endpoints for whitelist management
- `server/migrations/saml_integration.sql` - Database migration with initial entries
