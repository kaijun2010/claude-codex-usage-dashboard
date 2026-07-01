'use strict';

const fs = require('fs');
const path = require('path');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  const dumpPath = '/home/kaijun/.gemini/antigravity-cli/cache/statusline-dump.json';
  try {
    fs.writeFileSync(dumpPath, input);
  } catch (error) {
    fs.writeFileSync('/tmp/statusline-dump-err.txt', error.stack);
  }
  process.stdout.write('agy statusline test');
});
