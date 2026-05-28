const fs = require('fs');
const data = JSON.parse(fs.readFileSync('eslint_report.json', 'utf8'));
const file = data[0];
const undefs = file.messages.filter(m => m.ruleId === 'no-undef');
console.log('Undefined variables:', undefs.map(m => m.message + ' at line ' + m.line));
