import '@testing-library/jest-dom/extend-expect';
import 'whatwg-fetch';
import '@testing-library/jest-dom';

import { server } from './server';

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  });
});
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
});
