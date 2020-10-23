import { Logger } from '@verdaccio/types';

const logger: Logger = {
  error: (e) => console.warn(e),
  info: (e) => console.warn(e),
  debug: (e) => console.warn(e),
  warn: (e) => console.warn(e),
  child: (e) => console.warn(e),
  http: (e) => console.warn(e),
  trace: (e) => console.warn(e),
};

export default logger;
