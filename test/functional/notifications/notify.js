import _ from 'lodash';

import {HEADERS} from '../../../src/lib/constants';
import {notify} from '../../../src/lib/notify';
import {DOMAIN_SERVERS, PORT_SERVER_APP} from '../config.functional';

export default function(express) {
  const config = {
    notify: {
      method: 'POST',
      headers: [{
        'Content-Type': HEADERS.JSON
      }],
      endpoint: `http://${DOMAIN_SERVERS}:${PORT_SERVER_APP}/api/notify`,
      content: `{"color":"green","message":"New package published: * {{ name }}*. Publisher name: * {{ publisher.name }} *.","notify":true,"message_format":"text"}`
    }
  };

  const publisherInfo = {
    name: "publisher-name-test"
  };

  describe('notifications', () => {

    function parseBody(notification) {
      const jsonBody = JSON.parse(notification);

      return jsonBody;
    }

    beforeAll(function () {
      express.post('/api/notify', function (req, res) {
        res.send(req.body);
      });
      express.post('/api/notify/bad', function (req, res) {
        res.status(400);
        res.send('bad response');
      });
    });

    test('notification should be send', done => {
      const metadata = {
        name: "pkg-test"
      };

      notify(metadata, config, publisherInfo).then(function (body) {
        const jsonBody = parseBody(body);
        expect(
          `New package published: * ${metadata.name}*. Publisher name: * ${publisherInfo.name} *.`).toBe(jsonBody.message, "Body notify message should be equal");
        done();
      }, function (err) {
        expect(err).toBeDefined();
        done();
      });
    });

    test('notification should be send single header', done => {
      const metadata = {
        name: "pkg-test"
      };

      const configMultipleHeader = _.cloneDeep(config);
      configMultipleHeader.notify.headers = {
        'Content-Type': HEADERS.JSON
      };

      notify(metadata, configMultipleHeader, publisherInfo).then(function (body) {
        const jsonBody = parseBody(body);
        expect(
          `New package published: * ${metadata.name}*. Publisher name: * ${publisherInfo.name} *.`)
          .toBe(jsonBody.message, "Body notify message should be equal");
        done();
      }, function (err) {
        expect(err).toBeDefined();
        done();
      });
    });

    test(
      'notification should be send multiple notifications endpoints',
      done => {
        const metadata = {
          name: "pkg-test"
        };
        // let notificationsCounter = 0;

        const multipleNotificationsEndpoint = {
          notify: []
        };

        for (let i = 0; i < 10; i++) {
          const notificationSettings = _.cloneDeep(config.notify);
          // basically we allow al notifications
          notificationSettings.packagePattern = /^pkg-test$/;
          // notificationSettings.packagePatternFlags = 'i';
          multipleNotificationsEndpoint.notify.push(notificationSettings);
        }

        notify(metadata, multipleNotificationsEndpoint, publisherInfo).then(function (body) {
          body.forEach(function(notification) {
            const jsonBody = parseBody(notification);
            expect(
              `New package published: * ${metadata.name}*. Publisher name: * ${publisherInfo.name} *.`)
              .toBe(jsonBody.message, "Body notify message should be equal");
          });
          done();
        }, function (err) {
          expect(err).toBeDefined();
          done();
        });
      });

    test('notification should fails', done => {
      const metadata = {
        name: "pkg-test"
      };
      const configFail = _.cloneDeep(config);
      configFail.notify.endpoint = `http://${DOMAIN_SERVERS}:${PORT_SERVER_APP}/api/notify/bad`;

      notify(metadata, configFail, publisherInfo).then(function () {
        expect(false).toBe('This service should fails with status code 400');
        done();
      }, function (err) {
        expect(err).toEqual('bad response');
        done();
      });
    });

    test('publisher property should not be overridden if it exists in metadata', done => {
      const metadata = {
        name: 'pkg-test',
        publisher: {
          name: 'existing-publisher-name'
        }
      };

      notify(metadata, config, publisherInfo).then(
        function(body) {
          const jsonBody = parseBody(body);
          expect(`New package published: * ${metadata.name}*. Publisher name: * ${metadata.publisher.name} *.`)
            .toBe(jsonBody.message, 'Body notify message should be equal');
          done();
        },
        function(err) {
          expect(err).toBeDefined();
          done();
        }
      );
    });

  });
}
