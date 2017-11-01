/* eslint comma-dangle: 0 */

module.exports = {
  'name': 'verdaccio-jest',
  'verbose': true,
  'collectCoverage': true,
  'coveragePathIgnorePatterns': [
    'node_modules',
    'fixtures'
  ],
  'testRegex': '(/test/unit/.*\\.spec)\\.js'
};
