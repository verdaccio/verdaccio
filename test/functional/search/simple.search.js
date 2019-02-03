import {API_MESSAGE, HTTP_STATUS} from '../../../src/lib/constants';

const pkgExample = require('./search.json');

export default function(server, server2, express) {

  describe('should test search a published package', () => {
    const PKG_NAME = 'testpkg-search';

    beforeAll(function() {
      return server.putPackage(PKG_NAME, pkgExample)
        .status(HTTP_STATUS.CREATED)
        .body_ok(API_MESSAGE.PKG_CREATED);
    });

    describe('should test simple search', () => {
      const check = (medatada) => {
        medatada[PKG_NAME].time.modified = '2014-10-02T07:07:51.000Z';
        expect(medatada[PKG_NAME]).toEqual(
          {
            'name': PKG_NAME,
            'description': '',
            'author': '',
            'license': 'ISC',
            'dist-tags': {
              latest: '0.0.1'
            },
            'maintainers': [{
              name: 'alex',
              email: 'user@domain.com'
            }],
            'readmeFilename': '',
            'time': {
              modified: '2014-10-02T07:07:51.000Z'
            },
            'versions': {
              "0.0.1": "latest"
            },
            'repository': {
              type: 'git', url: ''}
          });
      };

      beforeAll(function() {
        express.get('/-/all', (req, res) => {
          res.send({});
        });
      });

      test('server1 - search', () => {
        return server.request({uri: '/-/all'})
          .status(HTTP_STATUS.OK)
          .then(check);
      });

      test('server2 - search', () => {
        return server2.request({uri: '/-/all'})
          .status(HTTP_STATUS.OK)
          .then(check);
      });

    });
  });
}
