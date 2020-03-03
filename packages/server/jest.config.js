module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  // FIXME: coverage fails here
  collectCoverage: false
};
