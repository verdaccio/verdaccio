/**
 * @prettier
 * Setup configuration for Jest
 * This file includes global settings for the JEST environment.
 */
import 'raf/polyfill';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.__APP_VERSION__ = '1.0.0';

// mocking few DOM methods
if (global.document) {
  document.createRange = jest.fn(() => ({
    selectNodeContents: () => {},
  }));
  document.execCommand = jest.fn();
}
