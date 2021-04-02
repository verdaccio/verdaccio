const path = require('path');

module.exports = () => {
  return {
    staticPath: path.join(__dirname, 'static'),
    manifest: require('./static/manifest.json'),
    manifestFiles: {
      js: ['runtime.js', 'vendors.js', 'main.js'],
    },
  };
};
