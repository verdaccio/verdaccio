import semver from 'semver';

if (semver.lte(process.version, 'v15.0.0')) {
  global.AbortController = require('abortcontroller-polyfill/dist/cjs-ponyfill').AbortController;
}

export { default } from './server';
