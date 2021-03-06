import { isURLhasValidProtocol } from '../src';

test('should be HTTP/HTTPS protocol', () => {
  expect(isURLhasValidProtocol('http://domain.com/-/static/logo.png')).toBeTruthy();
  expect(isURLhasValidProtocol('https://www.domain.com/-/static/logo.png')).toBeTruthy();
  expect(isURLhasValidProtocol('//domain.com/-/static/logo.png')).toBeTruthy();
});

test('should not be a valid HTTP protocol', () => {
  expect(isURLhasValidProtocol('file:///home/user/logo.png')).toBeFalsy();
  expect(isURLhasValidProtocol('file:///F:/home/user/logo.png')).toBeFalsy();
  // Note that uses ftp protocol in src was deprecated in modern browsers
  expect(isURLhasValidProtocol('ftp://1.2.3.4/home/user/logo.png')).toBeFalsy();
  expect(isURLhasValidProtocol('./logo.png')).toBeFalsy();
  expect(isURLhasValidProtocol('.\\logo.png')).toBeFalsy();
  expect(isURLhasValidProtocol('../logo.png')).toBeFalsy();
  expect(isURLhasValidProtocol('..\\logo.png')).toBeFalsy();
  expect(isURLhasValidProtocol('../../static/logo.png')).toBeFalsy();
  expect(isURLhasValidProtocol('..\\..\\static\\logo.png')).toBeFalsy();
  expect(isURLhasValidProtocol('logo.png')).toBeFalsy();
  expect(isURLhasValidProtocol('.logo.png')).toBeFalsy();
  expect(isURLhasValidProtocol('/static/logo.png')).toBeFalsy();
  expect(isURLhasValidProtocol('F:\\static\\logo.png')).toBeFalsy();
});
