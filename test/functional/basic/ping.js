import _ from 'lodash';

module.exports = function(server) {

  test('ping', () => {
    return server.ping().then(function (data) {
      // it's always an empty object
      expect(_.isObject(data)).toBeDefined();
    });
  });

};

