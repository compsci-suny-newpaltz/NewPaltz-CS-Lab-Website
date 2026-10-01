/**
 * Every write route and every route that returns applicant PII must require an
 * SSO admin. Audit 2026-10-01 found these reachable with no session at all.
 */
const crypto = require('crypto'); const fs = require('fs'); const os = require('os'); const path = require('path');
const express = require('express'); const cookieParser = require('cookie-parser'); const request = require('supertest');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cslab-test-'));
const { publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
fs.writeFileSync(path.join(tmp, 'pub.pem'), publicKey.export({ type: 'spki', format: 'pem' }));
process.env.JWT_PUBLIC_KEY_PATH = path.join(tmp, 'pub.pem');
process.env.DB_PATH = path.join(tmp, 'test.db');

const app = express();
app.use(express.json()); app.use(cookieParser());
app.use('/api/sd-forms', require('../src/routes/sdFormRoutes'));
app.use('/api/courses', require('../src/routes/coursesRoutes'));
app.use('/api/school-calendar', require('../src/routes/schoolCalendarRoutes'));
app.use('/api/student', require('../src/routes/studentRoutes'));

const cases = [
  ['get',    '/api/sd-forms/'],            ['get',    '/api/sd-forms/1'],
  ['delete', '/api/sd-forms/1'],           ['post',   '/api/sd-forms/1/approve'],
  ['post',   '/api/courses/'],             ['put',    '/api/courses/1'],
  ['delete', '/api/courses/1'],            ['post',   '/api/courses/1/syllabus'],
  ['post',   '/api/school-calendar/'],     ['put',    '/api/school-calendar/1'],
  ['delete', '/api/school-calendar/1'],    ['post',   '/api/school-calendar/1/no-school'],
  ['delete', '/api/school-calendar/no-school/1'], ['post', '/api/school-calendar/1/semester'],
  ['delete', '/api/school-calendar/semester/1'],  ['patch', '/api/school-calendar/1/set-default'],
  ['get',    '/api/student/'],             ['post',   '/api/student/'],
  ['delete', '/api/student/student-panel/1'], ['put', '/api/student/approve/1'],
];
describe('admin-only routes reject anonymous requests with 401', () => {
  test.each(cases)('%s %s', async (method, url) => {
    const r = await request(app)[method](url).send({});
    expect(r.status).toBe(401);
  });
  test('POST /api/student/createUser no longer exists', async () => {
    const r = await request(app).post('/api/student/createUser').send({ email: 'x@newpaltz.edu', nId: 'N1' });
    expect([401, 404]).toContain(r.status);
  });
});
