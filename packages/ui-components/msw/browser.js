import { setupWorker } from 'msw';

import { handlers } from '../jest/server-handlers';

export const worker = setupWorker(...handlers);
