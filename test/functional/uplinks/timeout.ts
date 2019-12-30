import {HTTP_STATUS} from "../../../src/lib/constants";

const PKG_SINGLE_UPLINK = 'test-uplink-timeout-single';
const PKG_MULTIPLE_UPLINKS = 'test-uplink-timeout-multiple';

export default function (server, server2, server3) {

  describe('uplink connection timeouts', () => {

    // more info: https://github.com/verdaccio/verdaccio/pull/1331

    jest.setTimeout(20000);
    beforeAll(async () => {
      await server2.addPackage(PKG_SINGLE_UPLINK).status(HTTP_STATUS.CREATED);
      await server2.addPackage(PKG_MULTIPLE_UPLINKS).status(HTTP_STATUS.CREATED);
      await server3.addPackage(PKG_MULTIPLE_UPLINKS).status(HTTP_STATUS.CREATED);
    });

    describe('get package', () => {
      test('503 response when uplink connection ESOCKETTIMEDOUT', () => {
        return server.getPackage(PKG_SINGLE_UPLINK).status(HTTP_STATUS.SERVICE_UNAVAILABLE);
      });

      test('200 response even though one uplink timeout', () => {
        return server.getPackage(PKG_MULTIPLE_UPLINKS).status(HTTP_STATUS.OK)
      });
    });

  });

}
