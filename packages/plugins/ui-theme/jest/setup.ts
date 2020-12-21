/**
 * Setup configuration for Jest
 * This file includes global settings for the JEST environment.
 */
import { GlobalWithFetchMock } from 'jest-fetch-mock';
import 'mutationobserver-shim';

// @ts-ignore : Property '__APP_VERSION__' does not exist on type 'Global'.
global.__APP_VERSION__ = '1.0.0';
// @ts-ignore : Property '__VERDACCIO_BASENAME_UI_OPTIONS' does not exist on type 'Global'.
global.__VERDACCIO_BASENAME_UI_OPTIONS = { base: 'http://localhost' };
// @ts-ignore : Property 'VERDACCIO_API_URL' does not exist on type 'Global'.
global.VERDACCIO_API_URL = 'https://verdaccio.tld';

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;

// mocking few DOM methods
// @ts-ignore : Property 'document' does not exist on type 'Global'.
if (global.document) {
  // @ts-ignore : Type 'Mock<{ selectNodeContents: () => void; }, []>' is not assignable to type '() => Range'.
  document.createRange = jest.fn((): void => ({
    selectNodeContents: (): void => {},
  }));
  document.execCommand = jest.fn();
}
