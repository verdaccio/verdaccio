import { CREDENTIALS } from '../config.functional';

export default function (server) {
  test('who am I?', () => {
    return server.whoami().then(function (username) {
      expect(username).toMatch(CREDENTIALS.user);
    });
  });
}
