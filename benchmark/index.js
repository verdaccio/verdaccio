/* eslint-disable no-console */
const { spawn } = require('child_process');
const path = require('path');

const hyperfine = spawn(
  'hyperfine',
  [
    '--ignore-failure',
    '--warmup',
    '1',
    '--runs',
    '2',
    `${path.resolve(__dirname, 'run-scenario.js')}`,
  ],
  { stdio: 'inherit' }
);

console.log('status', hyperfine.status);
