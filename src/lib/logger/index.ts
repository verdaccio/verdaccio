import { setup as setupModule } from '@verdaccio/logger-7';

let logger;

export function setup(options) {
  if (!logger) {
    logger = setupModule(options);
  }
}

export { logger };
