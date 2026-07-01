/**
 * Stub used only under Vitest (see vitest.config.mjs). The real @verdaccio/logger
 * expects ./build/prettify.js for pino transports; a fresh clone may not have
 * package builds yet.
 */
const noop = (): void => {};

export async function setup(): Promise<typeof logger> {
  return logger;
}

export const logger = {
  debug: noop,
  info: noop,
  error: noop,
  warn: noop,
};
