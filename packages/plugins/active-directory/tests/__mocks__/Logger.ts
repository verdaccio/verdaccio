import { vi } from 'vitest';

import { Logger } from '@verdaccio/types';

const logger: Logger = {
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
  child: vi.fn(),
  http: vi.fn(),
  trace: vi.fn(),
};

export default logger;
