/**
 * Setup configuration for Jest
 * This file includes global settings for the JEST environment.
 */
import 'raf/polyfill';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
