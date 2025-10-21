const fs = require('fs');
const path = require('path');

// Read the index.html template
const indexPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace the placeholder with the actual environment variable
const submitEndpoint = process.env.SUBMIT_ENDPOINT || '';
html = html.replace(/%SUBMIT_ENDPOINT%/g, submitEndpoint);

// Write back to the same file
fs.writeFileSync(indexPath, html, 'utf8');

console.log('✓ Environment variables injected into index.html');
console.log(`  SUBMIT_ENDPOINT: ${submitEndpoint || '(not set)'}`);
