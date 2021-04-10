import { HTTP_STATUS } from '@verdaccio/commons-api';

export default function (server) {
  describe('logout', () => {
    test('should log out', () => {
      return server
        .logout('some-token')
        .status(HTTP_STATUS.OK)
        .body_ok(/Logged out/);
    });
  });
}
