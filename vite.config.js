import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const leaderboardPlugin = () => ({
  name: 'leaderboard-api',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/leaderboard') {
        const filePath = path.resolve(__dirname, 'leaderboard.json');
        
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, JSON.stringify({ scores: [] }));
        }

        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(fs.readFileSync(filePath, 'utf8'));
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const leaderboard = JSON.parse(fs.readFileSync(filePath, 'utf8'));
              const existingIndex = leaderboard.scores.findIndex(s => s.name.toLowerCase() === data.name.toLowerCase());
              if (existingIndex !== -1) {
                leaderboard.scores[existingIndex].score = data.score;
                leaderboard.scores[existingIndex].date = new Date().toISOString();
              } else {
                leaderboard.scores.push({
                  name: data.name,
                  score: data.score,
                  date: new Date().toISOString()
                });
              }
              
              leaderboard.scores.sort((a, b) => b.score - a.score);
              fs.writeFileSync(filePath, JSON.stringify(leaderboard, null, 2));
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, scores: leaderboard.scores }));
            } catch (err) {
              res.statusCode = 500;
              res.end('Server Error');
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
  plugins: [react(), leaderboardPlugin()],
})
