const fs = require('fs');
let content = fs.readFileSync('src/data/questions.js', 'utf8');
// Remove prefixes like 'A. ', "B. ", etc.
content = content.replace(/(['"])[A-E]\.\s+/g, '$1');
fs.writeFileSync('src/data/questions.js', content);
console.log('Successfully removed prefixes from questions.js');
