// callback support
export * from './legacy/unclock';
export * from './legacy/readFile';
export * from './legacy/lockfile';
// promise support
export { readFileNext } from './readFile';
export { lockFileNext } from './lockfile';
export { unlockFileNext } from './utils';
