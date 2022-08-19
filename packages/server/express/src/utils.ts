const pkgVersion = require('../package.json').version;

export function getUserAgent(userAgent: string): string {
  if (typeof userAgent === 'string') {
    return userAgent;
  } else if (userAgent === false) {
    return 'hidden';
  }

  return `verdaccio/${pkgVersion}`;
}
