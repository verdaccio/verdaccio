const debug = require('debug')('test');

const setup = debug;
const logger = {
  child: jest.fn(() => ({
    debug,
    trace: debug,
    warn: debug,
    info: debug,
    error: debug,
    fatal: debug,
  })),
  debug: debug,
  trace: debug,
  warn: debug,
  info: debug,
  error: debug,
  fatal: debug,
};

export { setup, logger };
