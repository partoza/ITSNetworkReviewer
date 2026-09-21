import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import os from 'os';
import path from 'path';

const ALLOWED_SUBJECTS = new Set(['network-security', 'cybersecurity']);
const SUBJECT_QUESTION_COUNTS = { 'network-security': 40, cybersecurity: 255 };
const PLAYER_NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} ._'’-]*$/u;

const compareScores = (a, b) => (
  (b.score / (b.total || SUBJECT_QUESTION_COUNTS[b.subject || 'network-security']))
  - (a.score / (a.total || SUBJECT_QUESTION_COUNTS[a.subject || 'network-security']))
  || b.score - a.score
);

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
              const total = Number(data.total ?? SUBJECT_QUESTION_COUNTS[subject]);

              if (name.length < 2 || name.length > 30 || !PLAYER_NAME_PATTERN.test(name)) {
                sendJson(res, 400, { error: 'Player name must be 2–30 valid characters.' });
                return;
              }
              if (!ALLOWED_SUBJECTS.has(subject)) {
                sendJson(res, 400, { error: 'Unknown subject.' });
                return;
              }
              if (!Number.isInteger(total) || total < 1 || total > SUBJECT_QUESTION_COUNTS[subject]) {
                sendJson(res, 400, { error: `Question total must be a whole number from 1 to ${SUBJECT_QUESTION_COUNTS[subject]}.` });
                return;
              }
              if (!Number.isInteger(score) || score < 0 || score > total) {
                sendJson(res, 400, { error: `Score must be a whole number from 0 to ${total}.` });
                return;
              }

              const leaderboard = JSON.parse(fs.readFileSync(filePath, 'utf8'));
              const existingIndex = leaderboard.scores.findIndex((entry) => (
                entry.name.toLowerCase() === name.toLowerCase()
                && (entry.subject || 'network-security') === subject
              ));
              if (existingIndex !== -1) {
                leaderboard.scores[existingIndex].subject = subject;
                const existingEntry = leaderboard.scores[existingIndex];
                if (compareScores({ score, total, subject }, existingEntry) < 0) {
                  leaderboard.scores[existingIndex].score = score;
                  leaderboard.scores[existingIndex].total = total;
                  leaderboard.scores[existingIndex].date = new Date().toISOString();
                }
              } else {
                leaderboard.scores.push({
                  name,
                  score,
                  total,
                  date: new Date().toISOString(),
                  subject,
                });
              }
              
              leaderboard.scores.sort((a, b) => (
                (a.subject || 'network-security').localeCompare(b.subject || 'network-security')
                || compareScores(a, b)
              ));
              fs.writeFileSync(filePath, JSON.stringify(leaderboard, null, 2));
              
              const subjectScores = leaderboard.scores.filter((entry) => entry.subject === subject);
              sendJson(res, 200, {
                success: true,
                subject,
                personalBest: subjectScores.find((entry) => entry.name.toLowerCase() === name.toLowerCase())?.score,
                personalBestTotal: subjectScores.find((entry) => entry.name.toLowerCase() === name.toLowerCase())?.total || SUBJECT_QUESTION_COUNTS[subject],
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
