/**
 * Database configuration and connection module
 * SQLite database via better-sqlite3 (synchronous API)
 * Provides a compatibility wrapper that mimics the mariadb pool interface
 */

require('dotenv').config();
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'cslab.db');

/**
 * Initialize SQLite database connection
 * Uses WAL mode for better concurrency
 */
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Convert MariaDB-style ? placeholders to work with better-sqlite3.
 * MariaDB uses ? for positional params; better-sqlite3 also uses ? so this is compatible.
 *
 * Handles MariaDB-specific SQL syntax that SQLite doesn't support:
 * - ON DUPLICATE KEY UPDATE -> INSERT OR REPLACE (handled at query level)
 * - GROUP_CONCAT with SEPARATOR -> group_concat (SQLite supports this natively)
 */

/**
 * Execute a query and return results in a format compatible with mariadb driver.
 *
 * For SELECT: returns an array of row objects
 * For INSERT: returns { insertId, affectedRows }
 * For UPDATE/DELETE: returns { affectedRows }
 *
 * @param {string} sql - SQL query with ? placeholders
 * @param {Array} params - Parameter values
 * @returns {Array|Object} Query results
 */
function query(sql, params = []) {
    // Normalize params: convert undefined to null
    const normalizedParams = (params || []).map(p => (p === undefined ? null : p));

    // Trim leading whitespace for statement-type detection
    const trimmedSql = sql.trim();

    // Handle MariaDB's ON DUPLICATE KEY UPDATE syntax
    // Convert to INSERT OR REPLACE or use an upsert approach
    if (/ON\s+DUPLICATE\s+KEY\s+UPDATE/i.test(trimmedSql)) {
        return handleUpsert(trimmedSql, normalizedParams);
    }

    // Determine statement type
    const upperSql = trimmedSql.toUpperCase();

    if (upperSql.startsWith('SELECT') || upperSql.startsWith('PRAGMA') || upperSql.startsWith('WITH')) {
        // SELECT queries return rows as array of objects
        const stmt = db.prepare(trimmedSql);
        const rows = stmt.all(...normalizedParams);
        return rows;
    } else if (upperSql.startsWith('INSERT')) {
        const stmt = db.prepare(trimmedSql);
        const result = stmt.run(...normalizedParams);
        return {
            insertId: result.lastInsertRowid,
            affectedRows: result.changes
        };
    } else if (upperSql.startsWith('UPDATE') || upperSql.startsWith('DELETE')) {
        const stmt = db.prepare(trimmedSql);
        const result = stmt.run(...normalizedParams);
        return {
            affectedRows: result.changes
        };
    } else if (upperSql.startsWith('CREATE') || upperSql.startsWith('DROP') || upperSql.startsWith('ALTER')) {
        db.exec(trimmedSql);
        return { affectedRows: 0 };
    } else {
        // Fallback: try to run it
        const stmt = db.prepare(trimmedSql);
        const result = stmt.run(...normalizedParams);
        return {
            affectedRows: result.changes,
            insertId: result.lastInsertRowid
        };
    }
}

/**
 * Handle MariaDB ON DUPLICATE KEY UPDATE syntax by converting to SQLite upsert
 * @param {string} sql - Original SQL with ON DUPLICATE KEY UPDATE
 * @param {Array} params - Query parameters
 * @returns {Object} Result with affectedRows
 */
function handleUpsert(sql, params) {
    // Strategy: Try INSERT, if it fails due to unique constraint, do UPDATE
    // Extract the table name and columns from INSERT
    const insertMatch = sql.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
    if (!insertMatch) {
        // Fallback: just try running it with SQLite INSERT OR REPLACE
        const replaceSql = sql
            .replace(/INSERT\s+INTO/i, 'INSERT OR REPLACE INTO')
            .replace(/\s+ON\s+DUPLICATE\s+KEY\s+UPDATE[\s\S]*/i, '');
        const stmt = db.prepare(replaceSql);
        const insertParams = params.slice(0, (replaceSql.match(/\?/g) || []).length);
        const result = stmt.run(...insertParams);
        return { affectedRows: result.changes, insertId: result.lastInsertRowid };
    }

    const tableName = insertMatch[1];
    const columns = insertMatch[2].split(',').map(c => c.trim());
    const placeholders = insertMatch[3];

    // Extract UPDATE part after ON DUPLICATE KEY UPDATE
    const updatePart = sql.match(/ON\s+DUPLICATE\s+KEY\s+UPDATE\s+([\s\S]+)$/i);
    if (!updatePart) {
        const replaceSql = `INSERT OR REPLACE INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
        const insertParams = params.slice(0, columns.length);
        const stmt = db.prepare(replaceSql);
        const result = stmt.run(...insertParams);
        return { affectedRows: result.changes, insertId: result.lastInsertRowid };
    }

    // Convert VALUES(col) references in the UPDATE part to excluded.col (SQLite ON CONFLICT syntax)
    let updateSet = updatePart[1].trim();
    if (updateSet.endsWith(';')) updateSet = updateSet.slice(0, -1);

    // Replace VALUES(column_name) with excluded.column_name
    updateSet = updateSet.replace(/VALUES\((\w+)\)/gi, 'excluded.$1');

    // Build SQLite upsert: INSERT ... ON CONFLICT(id) DO UPDATE SET ...
    // Determine primary key (assume first column or 'id')
    const pkCol = columns[0] === 'id' ? 'id' : columns[0];

    const upsertSql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders}) ON CONFLICT(${pkCol}) DO UPDATE SET ${updateSet}`;

    const insertParams = params.slice(0, columns.length);
    try {
        const stmt = db.prepare(upsertSql);
        const result = stmt.run(...insertParams);
        return { affectedRows: result.changes, insertId: result.lastInsertRowid };
    } catch (err) {
        // If upsert fails, try INSERT OR REPLACE as fallback
        const replaceSql = `INSERT OR REPLACE INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
        const stmt = db.prepare(replaceSql);
        const result = stmt.run(...insertParams);
        return { affectedRows: result.changes, insertId: result.lastInsertRowid };
    }
}

/**
 * Connection wrapper that mimics mariadb's getConnection/release pattern.
 * Since better-sqlite3 is synchronous and doesn't need connection pooling,
 * we provide a thin compatibility layer.
 */
function getConnection() {
    // Track whether we're in a transaction
    let inTransaction = false;

    const connection = {
        /**
         * Execute a query (mimics mariadb conn.query)
         * Returns a Promise to maintain async interface compatibility
         */
        query: async function(sql, params) {
            return query(sql, params);
        },

        /**
         * Begin a transaction
         */
        beginTransaction: async function() {
            db.exec('BEGIN');
            inTransaction = true;
        },

        /**
         * Commit the current transaction
         */
        commit: async function() {
            if (inTransaction) {
                db.exec('COMMIT');
                inTransaction = false;
            }
        },

        /**
         * Rollback the current transaction
         */
        rollback: async function() {
            if (inTransaction) {
                try {
                    db.exec('ROLLBACK');
                } catch (e) {
                    // Transaction may have already been rolled back
                }
                inTransaction = false;
            }
        },

        /**
         * Release the connection (no-op for SQLite)
         */
        release: function() {
            // No-op: SQLite doesn't use connection pooling
            // If we're still in a transaction, roll it back to be safe
            if (inTransaction) {
                try {
                    db.exec('ROLLBACK');
                } catch (e) {
                    // Ignore errors during cleanup
                }
                inTransaction = false;
            }
        }
    };

    return connection;
}

/**
 * Pool-compatible interface
 * Wraps SQLite connection to match the mariadb pool API
 */
const pool = {
    getConnection: async function() {
        return getConnection();
    },

    query: async function(sql, params) {
        return query(sql, params);
    },

    end: async function() {
        db.close();
    }
};

// Test connection on module load
if (process.env.NODE_ENV !== 'test') {
    try {
        const testResult = query("SELECT 'Connected to SQLite!' AS message");
        console.log(testResult[0].message);
        console.log('Database path:', dbPath);
    } catch (err) {
        console.error("Error connecting to SQLite:", err);
    }
}

// Export the pool-compatible interface for use in other modules
module.exports = pool;
