import {DEFAULT_NO_README, HTTP_STATUS} from '../../../src/lib/constants';

export default function (server, server2) {

  describe('should test readme', () => {
    const README_PKG1 = 'readme-test';
    const README_PKG2 = 'readme-test-no-readme';

    beforeAll(async function() {
      await server.putPackage('readme-test', require('./pkg-readme.json'))
        .status(HTTP_STATUS.CREATED);
      await server.putPackage(README_PKG2, require('./pkg-no-readme.json'))
        .status(HTTP_STATUS.CREATED);
    });

    test('add pkg', () => {});

    describe('should check readme file', () => {
      const matchReadme = (serverRef, pkgName = README_PKG1, readmeMessage = 'this is a readme') => {
        return serverRef.request({
          uri: `/-/verdaccio/package/readme/${pkgName}`
        }).status(HTTP_STATUS.OK).then(function(body) {
          expect(body).toEqual(`<p>${readmeMessage}</p>\n`);
        });
      };

      test('should fetch server2 over uplink server1', () => {
        return matchReadme(server, README_PKG1, 'this is a readme');
      });

      test('should fetch package on local server1', () => {
        return matchReadme(server2, README_PKG1, 'this is a readme');
      });

      test('should fetch not found readme server2 over uplink server1', () => {
        return matchReadme(server, README_PKG2, DEFAULT_NO_README);
      });

      test('should fetch not found readme package on local server1', () => {
        return matchReadme(server2, README_PKG2, DEFAULT_NO_README);
      });


    });
  });
}
