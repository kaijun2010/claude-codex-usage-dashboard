'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const CACHE_PATH = process.env.AGY_USAGE_CACHE
  || path.join(os.homedir(), '.gemini', 'antigravity-cli', 'cache', 'agy-usage-cache.json');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  let session = {};
  try {
    session = JSON.parse(input) || {};
  } catch (error) {}

  const quota = session.quota || null;
  if (quota) {
    try {
      fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
      fs.writeFileSync(CACHE_PATH, JSON.stringify({
        fetchedAt: Date.now(),
        quota: quota,
      }));
    } catch (error) {}
  }

  let line = 'AGY';
  try {
    const gemini5h = quota && quota['gemini-5h'];
    const geminiWeekly = quota && quota['gemini-weekly'];
    const percent = (val) => (
      val && typeof val.remaining_fraction === 'number'
        ? Math.round((1 - val.remaining_fraction) * 100) + '%'
        : '--'
    );
    const model = (session.model && (session.model.display_name || session.model.id)) || 'Gemini';
    line = (gemini5h || geminiWeekly)
      ? model + '  5h used ' + percent(gemini5h)
        + ' · weekly used ' + percent(geminiWeekly)
      : model;
  } catch (error) {}

  process.stdout.write(line);
});
