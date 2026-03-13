import { createDeprecation, createWarning } from 'process-warning';

const verdaccioWarning = 'VerdaccioWarning';

export enum Codes {
  VERWAR001 = 'VERWAR001',
  VERWAR002 = 'VERWAR002',
  VERWAR003 = 'VERWAR003',
  VERWAR004 = 'VERWAR004',
  // deprecation warnings
  VERDEP003 = 'VERDEP003',
  VERWAR006 = 'VERWAR006',
  VERWAR007 = 'VERWAR007',
}

/* general warnings */

const warnings: Record<string, (a?: any, b?: any, c?: any) => void> = {};

warnings[Codes.VERWAR001] = createWarning({
  name: verdaccioWarning,
  code: Codes.VERWAR001,
  message: `Verdaccio doesn't need superuser privileges. don't run it under root`,
});

warnings[Codes.VERWAR002] = createWarning({
  name: verdaccioWarning,
  code: Codes.VERWAR002,
  message: `The configuration property "logs" has been deprecated, please rename to "log" for future compatibility`,
});

warnings[Codes.VERWAR003] = createWarning({
  name: verdaccioWarning,
  code: Codes.VERWAR003,
  message: 'rotating-file type is not longer supported, consider use [logrotate] instead',
});

warnings[Codes.VERWAR004] = createWarning({
  name: verdaccioWarning,
  code: Codes.VERWAR004,
  message: `invalid address - %s, we expect a port (e.g. "4873"),
host:port (e.g. "localhost:4873") or full url '(e.g. "http://localhost:4873/")
https://verdaccio.org/docs/en/configuration#listen-port`,
});

warnings[Codes.VERWAR006] = createDeprecation({
  code: Codes.VERWAR006,
  message:
    'the auth plugin method "add_user" in the auth plugin is deprecated and will be removed in next major release, rename to "adduser"',
});

warnings[Codes.VERWAR007] = createDeprecation({
  code: Codes.VERWAR007,
  message: `the secret length is too long, it must be 32 characters long, please consider generate a new one
  Learn more at https://verdaccio.org/docs/configuration/#.verdaccio-db`,
});

/* deprecation warnings */

warnings[Codes.VERDEP003] = createDeprecation({
  code: Codes.VERDEP003,
  message: 'multiple addresses will be deprecated in the next major, only use one',
});

export function emit(code: string, a?: string, b?: string, c?: string) {
  const warning = warnings[code];
  if (warning) {
    warning(a, b, c);
  }
}
