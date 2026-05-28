const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
console.log('App.jsx lines:', content.split('\n').length);
