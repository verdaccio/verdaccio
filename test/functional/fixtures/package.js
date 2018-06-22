import {PORT_SERVER_1} from "../../../src/lib/constants";

module.exports = function(name, version = '0.0.0', port = PORT_SERVER_1, domain= `http://localhost:${port}`) {
  return {
    name: name,
    version: version,
    readme: "this is a readme",
    dist: {
      shasum: 'fake',
      tarball: `${domain}/${encodeURIComponent(name)}/-/blahblah`,
    },
  };
};

