import {DOMAIN_SERVERS, PORT_SERVER_1, TARBALL} from '../constants';

export default function(name, version = '0.0.0', port = PORT_SERVER_1, domain= `http://${DOMAIN_SERVERS}:${port}`,
  fileName = TARBALL, readme = 'this is a readme'): any {
    return {
      name,
      version,
      readme,
      dist: {
        shasum: 'fake',
        tarball: `${domain}/${encodeURIComponent(name)}/-/${fileName}`,
      }
  };
}
