import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { server } from './server';

// Configure the test environment URL
Object.defineProperty(window, 'location', {
  writable: true,
  value: new URL('http://localhost:9000/'),
});

beforeAll(() => {
  // Enable debug logging
  // server.events.on('request:start', (req) => {
  //   console.log('Request started:', req.url.href);
  // });
  // server.events.on('request:match', (req) => {
  //   console.log('Request matched:', req.url.href);
  // });
  // server.events.on('request:unhandled', (req) => {
  //   console.warn('Unhandled request:', req.url.href);
  // });
  // server.events.on('request:end', (req) => {
  //   console.log('Request completed:', req.url.href);
  // });
  server.listen({
    onUnhandledRequest: 'warn',
  });
});
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
});
