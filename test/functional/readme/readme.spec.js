import assert from 'assert';

export default function (server, server2) {

  describe('should test readme', () => {

    beforeAll(function() {
      return server.request({
        uri: '/readme-test',
        headers: {
          'content-type': 'application/json',
        },
        method: 'PUT',
        json: require('./pkg-readme.json'),
      }).status(201);
    });

    test('add pkg', () => {});

    describe('should check readme file', () => {
      const matchReadme = (server) => {
        return server.request({
          uri: '/-/verdaccio/package/readme/readme-test'
        }).status(200).then(function(body) {
          assert.equal(body, '<p>this is a readme</p>\n');
        });
      };

      test('server1 - readme', () => {
        return matchReadme(server);
      });

      test('server2 - readme', () => {
        return matchReadme(server2);
      });

    });
  });
}
