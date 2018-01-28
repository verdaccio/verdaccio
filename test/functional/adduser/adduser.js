export default function(server) {
  describe('npm adduser', () => {
    const user = String(Math.random());
    const pass = String(Math.random());

    beforeAll(function() {
      return server.auth(user, pass)
               .status(201)
               .body_ok(/user .* created/);
    });

    test('should create new user', () => {});

    test('should log in', () => {
      return server.auth(user, pass)
               .status(201)
               .body_ok(/you are authenticated as/);
    });

    test('should not register more users', () => {
      return server.auth(String(Math.random()), String(Math.random()))
               .status(409)
               .body_error(/maximum amount of users reached/);
    });
  });
}
