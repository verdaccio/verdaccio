module.exports = function(name, version = '0.0.0', port = '55551', domain= `http://localhost:${port}`) {
  return {
    name: name,
    version: version,
    dist: {
      shasum: 'fake',
      tarball: `${domain}/${encodeURIComponent(name)}/-/blahblah`,
    },
  };
};

