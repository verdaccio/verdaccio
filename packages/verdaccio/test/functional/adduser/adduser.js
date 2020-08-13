import { API_ERROR, HTTP_STATUS } from '@verdaccio/dev-commons';

export default function (server) {
  describe('npm adduser', () => {
    const user = String(Math.random());
    const pass = String(Math.random());

    beforeAll(function () {
      return server
        .auth(user, pass)
        .status(HTTP_STATUS.CREATED)
        .body_ok(/user .* created/);
    });

    test('should create new user', () => {});

    test('should log in', () => {
      return server
        .auth(user, pass)
        .status(HTTP_STATUS.CREATED)
        .body_ok(/you are authenticated as/);
    });

    test('should not register more users', () => {
      return server.auth(String(Math.random()), String(Math.random())).status(HTTP_STATUS.CONFLICT).body_error(API_ERROR.MAX_USERS_REACHED);
    });
  });
}
