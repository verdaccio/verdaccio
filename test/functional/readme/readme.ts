import { DEFAULT_NO_README, HTTP_STATUS } from '../../../src/lib/constants';
import pkgNoReadmeJSON from './pkg-no-readme.json';
import pkgNoReadmeJSONOldFormat from './pkg-readme-npm6.json';
import pkgReadmeJSON from './pkg-readme.json';

export default function (server, server2) {
  describe('should test readme', () => {
    const README_PKG1 = 'readme-test';
    const README_PKG2 = 'readme-test-no-readme';
    const README_MESSAGE = 'this is a readme';
    const README_PKG3 = 'readme-test-npm6';

    beforeAll(async function () {
      await server.putPackage('readme-test', pkgReadmeJSON).status(HTTP_STATUS.CREATED);
      await server.putPackage(README_PKG2, pkgNoReadmeJSON).status(HTTP_STATUS.CREATED);
      await server.putPackage(README_PKG3, pkgNoReadmeJSONOldFormat).status(HTTP_STATUS.CREATED);
    });

    test('add pkg', () => {});

    describe('should check readme file', () => {
      const matchReadme = (serverRef, pkgName = README_PKG1, readmeMessage = README_MESSAGE) => {
        return serverRef
          .request({
            uri: `/-/verdaccio/package/readme/${pkgName}`,
          })
          .status(HTTP_STATUS.OK)
          .then(function (body) {
            expect(body).toEqual(`<p>${readmeMessage}</p>`);
          });
      };

      test('should fetch server2 over uplink server1', () => {
        return matchReadme(server, README_PKG1, README_MESSAGE);
      });

      test('should fetch package on local server1', () => {
        return matchReadme(server2, README_PKG1, README_MESSAGE);
      });

      test('should fetch not found readme server2 over uplink server1', () => {
        return matchReadme(server, README_PKG2, DEFAULT_NO_README);
      });

      test('should fetch found readme special case for npm6', () => {
        return matchReadme(server, README_PKG3, DEFAULT_NO_README);
      });

      test('should fetch not found readme package on local server1', () => {
        return matchReadme(server2, README_PKG2, DEFAULT_NO_README);
      });
    });
  });
}
