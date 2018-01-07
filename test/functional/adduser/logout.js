export default function(server) {

  describe('logout', () => {
    test('should log out', () => {
      return server.logout('some-token')
               .status(200)
               .body_ok(/Logged out/);
    });
  });
}
