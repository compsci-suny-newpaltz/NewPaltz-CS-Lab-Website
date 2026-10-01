/**
 * /api/admins must be reachable only by an SSO-authenticated admin.
 * Reported 2026-10-01: GET /api/admins dumped the admin list and POST created
 * admin accounts with no login at all.
 */
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const request = require('supertest');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cslab-test-'));
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
fs.writeFileSync(path.join(tmp, 'pub.pem'), publicKey.export({ type: 'spki', format: 'pem' }));
process.env.JWT_PUBLIC_KEY_PATH = path.join(tmp, 'pub.pem');
process.env.DB_PATH = path.join(tmp, 'test.db');
process.env.ADMIN_WHITELIST = 'admin1@newpaltz.edu';

const adminRoutes = require('../src/routes/adminRoutes');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/admins', adminRoutes);

const cookieFor = (claims) => 'np_access=' + jwt.sign(
  { iss: 'https://hydra.newpaltz.edu', aud: 'npsites', ...claims },
  privateKey.export({ type: 'pkcs8', format: 'pem' }), { algorithm: 'RS256', expiresIn: '5m' });
const STUDENT = cookieFor({ email: 'stu1@newpaltz.edu', affiliation: 'student' });
const ADMIN   = cookieFor({ email: 'admin1@newpaltz.edu', affiliation: 'staff' });

describe('/api/admins requires an SSO admin', () => {
  test('GET / without a session is 401', async () => {
    const r = await request(app).get('/api/admins/');
    expect(r.status).toBe(401);
  });
  test('POST / without a session is 401 (no account created)', async () => {
    const r = await request(app).post('/api/admins/').send({ user: 'x', email: 'x@x', password: 'p', role: 'admin' });
    expect(r.status).toBe(401);
  });
  test('a logged-in student is 403', async () => {
    const r = await request(app).get('/api/admins/').set('Cookie', STUDENT);
    expect(r.status).toBe(403);
  });
  test('DELETE /admin-panel/:id as a student is 403', async () => {
    const r = await request(app).delete('/api/admins/admin-panel/1').set('Cookie', STUDENT);
    expect(r.status).toBe(403);
  });
  test('a whitelisted admin gets past the gate', async () => {
    const r = await request(app).get('/api/admins/').set('Cookie', ADMIN);
    expect([401, 403]).not.toContain(r.status);
  });
});
