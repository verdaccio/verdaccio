import '@testing-library/jest-dom';
import 'mutationobserver-shim';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import 'whatwg-fetch';

import { server } from './jest/server';

//
// Mock react-markdown globally
vi.mock('react-markdown', () => import('../__mocks__/react-markdown'));

// @ts-ignore : Property '__VERDACCIO_BASENAME_UI_OPTIONS' does not exist on type 'Global'.
global.__VERDACCIO_BASENAME_UI_OPTIONS = {
  base: 'http://localhost:9000/',
  protocol: 'http',
  host: 'localhost',
  primaryColor: '#4b5e40',
  url_prefix: '',
  darkMode: false,
  language: 'en-US',
  uri: 'http://localhost:9000/',
  pkgManagers: ['pnpm', 'yarn', 'npm'],
  title: 'Verdaccio Dev UI',
  scope: '',
  version: 'v1.0.0',
};

// mocking few DOM methods
// @ts-ignore : Property 'document' does not exist on type 'Global'.
if (global.document) {
  // @ts-ignore : Type 'Mock<{ selectNodeContents: () => void; }, []>' is not assignable to type '() => Range'.
  document.createRange = vi.fn((): void => ({
    selectNodeContents: (): void => {},
  }));
  document.execCommand = vi.fn();
}

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  });
});
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
});