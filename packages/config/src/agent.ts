const pkgVersion = require('../package.json').version;

export function getUserAgent(): string {
  return `verdaccio/${pkgVersion}`;
}
