/**
 * Mock response for logo api
 * @returns {promise}
 */
export default function <T>(): Promise<T> {
  return Promise.resolve('http://localhost/-/static/logo.png');
}
