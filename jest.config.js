/* eslint comma-dangle: 0 */

module.exports = {
  'name': 'verdaccio-jest',
  'verbose': true,
  'collectCoverage': true,
  'coveragePathIgnorePatterns': [
    'node_modules',
    'fixtures'
  ],
  'testRegex': '(/test/unit.*\\.spec|test/functional.*\\.func|/test/webui/.*\\.spec)\\.js',
  // 'testRegex': '(test/functional.*\\.func)\\.js'
  'setupFiles': [
    './test/webui/global.js'
  ],
  'modulePathIgnorePatterns': [
    'global.js'
  ],
  'moduleNameMapper': {
    '\\.(scss)$': '<rootDir>/node_modules/identity-obj-proxy',
    'github-markdown-css': '<rootDir>/node_modules/identity-obj-proxy',
    '\\.(png)$': '<rootDir>/node_modules/identity-obj-proxy',
    'api': '<rootDir>/test/webui/components/__mocks__/api.js',
    'storage': '<rootDir>/test/webui/components/__mocks__/storage.js',
  },
  'transformIgnorePatterns': [
    '<rootDir>/node_modules/(?!react-syntax-highlighter)'
  ]
};
