module.exports = function(name, version) {
  return {
    name,
    version: version || '0.0.0',
    dist: {
      shasum: 'fake',
      tarball: `http://localhost:55551/${encodeURIComponent(name)}/-/blahblah`,
    },
  };
};

