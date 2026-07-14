fetch('http://localhost:5173/api/leaderboard', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'System Test', score: 40 })
}).then(res => res.json()).then(console.log).catch(console.error);
