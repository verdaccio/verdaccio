const setup = jest.fn();
const logger =  {
  child: jest.fn(() => ({
    debug: console.log,
    trace:  console.log,
    warn:  console.log,
    info:  console.log,
    error:  console.log,
    fatal: console.log,
  })),
  debug: console.log,
  trace:  console.log,
  warn:  console.log,
  info:  console.log,
  error:  console.log,
  fatal: console.log,
};

export { setup, logger }
