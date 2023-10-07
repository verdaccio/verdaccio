import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { server } from './server';

// mock load translations to avoid warnings
jest.mock('../src/i18n/loadTranslationFile');

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  });
});
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
});
