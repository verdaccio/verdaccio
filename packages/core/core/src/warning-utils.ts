import warning from 'process-warning';

const warningInstance = warning();
const verdaccioWarning = 'VerdaccioWarning';
const verdaccioDeprecation = 'VerdaccioDeprecation';

export enum Codes {
  VERWAR001 = 'VERWAR001',
  VERWAR002 = 'VERWAR002',
  VERWAR003 = 'VERWAR003',
  VERWAR004 = 'VERWAR004',
  VERWAR005 = 'VERWAR005',
  // deprecation warnings
  VERDEP003 = 'VERDEP003',
}

warningInstance.create(
  verdaccioWarning,
  Codes.VERWAR002,
  `The configuration property "logs" has been deprecated, please rename to "log" for future compatibility`
);

warningInstance.create(
  verdaccioWarning,
  Codes.VERWAR001,
  `Verdaccio doesn't need superuser privileges. don't run it under root`
);

warningInstance.create(
  verdaccioWarning,
  Codes.VERWAR003,
  'rotating-file type is not longer supported, consider use [logrotate] instead'
);

warningInstance.create(
  verdaccioWarning,
  Codes.VERWAR004,
  `invalid address - %s, we expect a port (e.g. "4873"), 
host:port (e.g. "localhost:4873") or full url '(e.g. "http://localhost:4873/")
https://verdaccio.org/docs/en/configuration#listen-port`
);

warningInstance.create(
  verdaccioWarning,
  Codes.VERWAR005,
  'disable enhanced legacy signature is considered a security risk, please reconsider enable it'
);

warningInstance.create(
  verdaccioDeprecation,
  Codes.VERDEP003,
  'multiple addresses will be deprecated in the next major, only use one'
);

export function emit(code: string, a?: string, b?: string, c?: string) {
  warningInstance.emit(code, a, b, c);
}
