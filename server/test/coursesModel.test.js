/**
 * GET /api/courses returned 500 in production since the SQLite migration:
 * "near SEPARATOR: syntax error". The courses queries used MariaDB's
 * GROUP_CONCAT(DISTINCT ... SEPARATOR ';;'), which SQLite rejects.
 */
const fs = require('fs'); const os = require('os'); const path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cslab-courses-'));
process.env.DB_PATH = path.join(tmp, 'test.db');

const Database = require('better-sqlite3');
const db = new Database(process.env.DB_PATH);
db.exec(`
  CREATE TABLE Courses (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, name TEXT NOT NULL, section TEXT DEFAULT '01',
    professor TEXT NOT NULL, semester TEXT NOT NULL, description TEXT, syllabusFile TEXT, category TEXT DEFAULT 'core',
    color TEXT, crn TEXT, credits INTEGER DEFAULT 3, days TEXT, time TEXT, location TEXT, slug TEXT);
  CREATE TABLE CourseResources (id INTEGER PRIMARY KEY AUTOINCREMENT, course_id INTEGER NOT NULL, name TEXT NOT NULL,
    url TEXT NOT NULL, description TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
  INSERT INTO Courses (code, name, professor, semester, category, slug) VALUES
    ('CPS 330', 'Under the Hood', 'Prof A', 'Fall 2026', 'core', 'cps-330'),
    ('CPS 493', 'Topics', 'Prof B', 'Fall 2026', 'elective', 'cps-493');
  INSERT INTO CourseResources (course_id, name, url, description) VALUES
    (1, 'Textbook', 'https://example.com/book', 'the book'),
    (1, 'ILCC', 'https://hydra.newpaltz.edu/ilcc', NULL);
`);
db.close();

const courses = require('../src/models/coursesModel');

describe('courses queries work on SQLite', () => {
  test('getAllCourses returns courses with parsed resources', async () => {
    const rows = await courses.getAllCourses();
    expect(rows.map(r => r.code)).toEqual(['CPS 330', 'CPS 493']);
    const c330 = rows.find(r => r.code === 'CPS 330');
    expect(c330.resources).toHaveLength(2);
    const byName = Object.fromEntries(c330.resources.map(r => [r.name, r]));   // group_concat order is unspecified
    expect(byName.Textbook).toEqual({ name: 'Textbook', url: 'https://example.com/book', description: 'the book' });
    expect(byName.ILCC).toEqual({ name: 'ILCC', url: 'https://hydra.newpaltz.edu/ilcc', description: '' });
    expect(rows.find(r => r.code === 'CPS 493').resources).toEqual([]);
  });
  test('getCoursesByCategory filters and parses resources', async () => {
    const rows = await courses.getCoursesByCategory('core');
    expect(rows).toHaveLength(1);
    expect(rows[0].resources).toHaveLength(2);
  });
});
