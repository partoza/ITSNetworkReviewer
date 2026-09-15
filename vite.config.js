import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_SUBJECTS = new Set(['network-security', 'cybersecurity']);
const SUBJECT_QUESTION_COUNTS = { 'network-security': 40, cybersecurity: 255 };
const PLAYER_NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} ._'’-]*$/u;
const DEFAULT_PASSCODE_HASH = '6ccf5eb0b98684778c3b1a5415fdeecd6819dd2ef1cfb22eee2c775cc41dc9cf';
const AUTH_COOKIE = 'its_reviewer_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const sessions = new Map();
const failedAttempts = new Map();

const parseCookies = (header = '') => Object.fromEntries(
  header.split(';').map((part) => part.trim().split('=').map(decodeURIComponent)).filter(([key]) => key),
);

const isAuthorized = (req) => {
  const token = parseCookies(req.headers.cookie)[AUTH_COOKIE];
  const expiresAt = token ? sessions.get(token) : null;
  if (!expiresAt || expiresAt <= Date.now()) {
    if (token) sessions.delete(token);
    return false;
  }
  return true;
};

const passcodeMatches = (passcode) => {
  const configuredPasscode = process.env.ITS_REVIEWER_PASSCODE;
  const expectedHash = configuredPasscode
    ? crypto.createHash('sha256').update(configuredPasscode).digest()
    : Buffer.from(DEFAULT_PASSCODE_HASH, 'hex');
  const suppliedHash = crypto.createHash('sha256').update(passcode).digest();
  return crypto.timingSafeEqual(suppliedHash, expectedHash);
};

const sendJson = (res, statusCode, data) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
};

const leaderboardPlugin = () => ({
  name: 'leaderboard-api',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const requestUrl = new URL(req.url, 'http://localhost');

      if (requestUrl.pathname === '/api/auth/status' && req.method === 'GET') {
        sendJson(res, 200, { authenticated: isAuthorized(req) });
        return;
      }

      if (requestUrl.pathname === '/api/auth' && req.method === 'POST') {
        const clientId = req.socket.remoteAddress || 'unknown';
        const attempt = failedAttempts.get(clientId);
        if (attempt && attempt.resetAt > Date.now() && attempt.count >= MAX_ATTEMPTS) {
          const retryAfter = Math.ceil((attempt.resetAt - Date.now()) / 1000);
          res.setHeader('Retry-After', String(retryAfter));
          sendJson(res, 429, { error: 'Too many attempts. Please wait before trying again.', retryAfter });
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          if (body.length <= 1000) body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const passcode = JSON.parse(body)?.passcode;
            if (typeof passcode !== 'string' || passcode.length > 64 || !passcodeMatches(passcode)) {
              const current = attempt && attempt.resetAt > Date.now()
                ? attempt
                : { count: 0, resetAt: Date.now() + ATTEMPT_WINDOW_MS };
              current.count += 1;
              failedAttempts.set(clientId, current);
              sendJson(res, 401, { error: 'Invalid access code.' });
              return;
            }

            failedAttempts.delete(clientId);
            const token = crypto.randomBytes(32).toString('base64url');
            sessions.set(token, Date.now() + SESSION_DURATION_MS);
            const isSecure = req.socket.encrypted || req.headers['x-forwarded-proto'] === 'https';
            res.setHeader('Set-Cookie', `${AUTH_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_MS / 1000}${isSecure ? '; Secure' : ''}`);
            sendJson(res, 200, { authenticated: true });
          } catch {
            sendJson(res, 400, { error: 'Invalid authentication request.' });
          }
        });
        return;
      }

      if (
        (requestUrl.pathname === '/api/network-info' || requestUrl.pathname === '/api/leaderboard')
        && !isAuthorized(req)
      ) {
        sendJson(res, 401, { error: 'Authentication required.' });
        return;
      }

      if (requestUrl.pathname === '/api/network-info' && req.method === 'GET') {
        const host = req.headers.host || 'localhost:5173';
        const port = new URL(`http://${host}`).port || '80';
        const urls = [];

        Object.entries(os.networkInterfaces()).forEach(([networkName, addresses]) => {
          addresses?.forEach((address) => {
            if (address.family === 'IPv4' && !address.internal) {
              urls.push({
                networkName,
                address: address.address,
                url: `http://${address.address}:${port}`,
              });
            }
          });
        });

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify({ port, urls }));
        return;
      }

      if (requestUrl.pathname === '/api/leaderboard') {
        const filePath = path.resolve(__dirname, 'leaderboard.json');
        
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, JSON.stringify({ scores: [] }));
        }

        if (req.method === 'GET') {
          const subject = requestUrl.searchParams.get('subject');
          if (subject && !ALLOWED_SUBJECTS.has(subject)) {
            sendJson(res, 400, { error: 'Unknown subject.' });
            return;
          }
          const leaderboard = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const scores = subject
            ? leaderboard.scores.filter((entry) => (entry.subject || 'network-security') === subject)
            : leaderboard.scores;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify({ subject, scores }));
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          let bodyTooLarge = false;
          req.on('data', chunk => {
            if (body.length + chunk.length > 10000) {
              bodyTooLarge = true;
              return;
            }
            body += chunk.toString();
          });
          req.on('end', () => {
            if (bodyTooLarge) {
              sendJson(res, 413, { error: 'Request is too large.' });
              return;
            }

            try {
              const data = JSON.parse(body);
              const name = typeof data.name === 'string' ? data.name.trim().replace(/\s+/g, ' ') : '';
              const subject = typeof data.subject === 'string' ? data.subject.trim() : '';
              const score = Number(data.score);

              if (name.length < 2 || name.length > 30 || !PLAYER_NAME_PATTERN.test(name)) {
                sendJson(res, 400, { error: 'Player name must be 2–30 valid characters.' });
                return;
              }
              if (!ALLOWED_SUBJECTS.has(subject)) {
                sendJson(res, 400, { error: 'Unknown subject.' });
                return;
              }
              if (!Number.isInteger(score) || score < 0 || score > SUBJECT_QUESTION_COUNTS[subject]) {
                sendJson(res, 400, { error: `Score must be a whole number from 0 to ${SUBJECT_QUESTION_COUNTS[subject]}.` });
                return;
              }

              const leaderboard = JSON.parse(fs.readFileSync(filePath, 'utf8'));
              const existingIndex = leaderboard.scores.findIndex((entry) => (
                entry.name.toLowerCase() === name.toLowerCase()
                && (entry.subject || 'network-security') === subject
              ));
              if (existingIndex !== -1) {
                leaderboard.scores[existingIndex].subject = subject;
                if (score > leaderboard.scores[existingIndex].score) {
                  leaderboard.scores[existingIndex].score = score;
                  leaderboard.scores[existingIndex].date = new Date().toISOString();
                }
              } else {
                leaderboard.scores.push({
                  name,
                  score,
                  date: new Date().toISOString(),
                  subject,
                });
              }
              
              leaderboard.scores.sort((a, b) => (
                (a.subject || 'network-security').localeCompare(b.subject || 'network-security')
                || b.score - a.score
              ));
              fs.writeFileSync(filePath, JSON.stringify(leaderboard, null, 2));
              
              const subjectScores = leaderboard.scores.filter((entry) => entry.subject === subject);
              sendJson(res, 200, {
                success: true,
                subject,
                personalBest: subjectScores.find((entry) => entry.name.toLowerCase() === name.toLowerCase())?.score,
                scores: subjectScores,
              });
            } catch {
              sendJson(res, 400, { error: 'Invalid leaderboard request.' });
            }
          });
          return;
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [react(), tailwindcss(), leaderboardPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    watch: {
      // Score submissions update this runtime data file. It is not application
      // source and must not trigger a full-page reload that resets the quiz UI.
      ignored: ['**/leaderboard.json'],
    },
  },
  preview: {
    host: '0.0.0.0',
  },
})
