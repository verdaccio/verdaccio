module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  verbose: true,
  // FIXME: coverage fails here
  collectCoverage: false
};
