import { certPem, csrPem, keyPem } from '@verdaccio/dev-commons';

import { resolveConfigPath } from './cli-utils';

const logger = require('@verdaccio/logger');

export function logHTTPSWarning(storageLocation) {
  logger.logger.fatal(
    [
      'You have enabled HTTPS and need to specify either ',
      '    "https.key", "https.cert" and "https.ca" or ',
      '    "https.pfx" and optionally "https.passphrase" ',
      'to run https server',
      '',
      // commands are borrowed from node.js docs
      'To quickly create self-signed certificate, use:',
      ' $ openssl genrsa -out ' + resolveConfigPath(storageLocation, keyPem) + ' 2048',
      ' $ openssl req -new -sha256 -key ' +
        resolveConfigPath(storageLocation, keyPem) +
        ' -out ' +
        resolveConfigPath(storageLocation, csrPem),
      ' $ openssl x509 -req -in ' +
        resolveConfigPath(storageLocation, csrPem) +
        ' -signkey ' +
        resolveConfigPath(storageLocation, keyPem) +
        ' -out ' +
        resolveConfigPath(storageLocation, certPem),
      '',
      'And then add to config file (' + storageLocation + '):',
      '  https:',
      `    key: ${resolveConfigPath(storageLocation, keyPem)}`,
      `    cert: ${resolveConfigPath(storageLocation, certPem)}`,
      `    ca: ${resolveConfigPath(storageLocation, csrPem)}`,
    ].join('\n')
  );
  process.exit(2);
}
