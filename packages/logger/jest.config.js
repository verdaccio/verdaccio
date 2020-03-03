module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  verbose: true,
  collectCoverage: false,
  coveragePathIgnorePatterns: ['node_modules', 'fixtures'],
};
