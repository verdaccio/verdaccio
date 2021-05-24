/* eslint-disable no-console */
const { spawn } = require('child_process');
const path = require('path');

const prepare = path.resolve(__dirname, 'prepare.js');
const run = path.resolve(__dirname, 'run-scenario.js');
console.log('-prepare-', prepare);
console.log('-run-', run);

const hyperfine = spawn(
  'hyperfine',
  [
    '--ignore-failure',
    '--warmup',
    '1',
    '--export-json',
    `${path.resolve(__dirname, './bench-results.json')}`,
    '--runs',
    '2',
    '--show-output',
    '--prepare',
    `${prepare}`,
    `${run} `,
  ],
  { stdio: 'inherit' }
);

console.log('status', hyperfine.status);
