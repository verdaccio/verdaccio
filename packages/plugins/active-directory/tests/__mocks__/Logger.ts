import { Logger } from '@verdaccio/types';

const logger: Logger = {
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  child: jest.fn(),
  http: jest.fn(),
  trace: jest.fn(),
};

export default logger;
