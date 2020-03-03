module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  verbose: true,
  // FIXME: the coverage returns an error here
  collectCoverage: false
};
