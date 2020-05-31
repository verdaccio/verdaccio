const setup = jest.fn();
const logger =  {
  child: jest.fn(() => ({
    trace: jest.fn()
  })),
  debug: jest.fn(),
  trace:  jest.fn(),
  warn:  jest.fn(),
  error:  jest.fn(),
  fatal: jest.fn(),
};

export { setup, logger }
