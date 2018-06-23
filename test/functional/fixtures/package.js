import {PORT_SERVER_1, TARBALL} from '../config.func';

module.exports = function(name, version = '0.0.0', port = PORT_SERVER_1, domain= `http://localhost:${port}`,
                          fileName = TARBALL, readme = 'this is a readme') {
  return {
    name,
    version,
    readme,
    dist: {
      shasum: 'fake',
      tarball: `${domain}/${encodeURIComponent(name)}/-/${fileName}`,
    },
  };
};

