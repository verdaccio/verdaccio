import assert from 'assert';
import _ from 'lodash';

import {notify} from '../../../src/lib/notify';

export default function(express) {
  const config = {
    notify: {
      method: 'POST',
      headers: [{
        'Content-Type': 'application/json'
      }],
      endpoint: "http://localhost:55550/api/notify",
      content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
    }
  };

  describe('notifications', () => {

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

      notify(metadata, config).then(function (body) {
        const jsonBody = JSON.parse(body);
        assert.ok(`New package published: * ${metadata.name}*` === jsonBody.message,
        'Body notify message should be equal');
        done();
      }, function (err) {
        assert.fail(err);
        done();
      });
    });

    test('notification should be send single header', done => {
      const metadata = {
        name: "pkg-test"
      };

      const configMultipleHeader = _.cloneDeep(config);
      configMultipleHeader.notify.headers = {
        'Content-Type': 'application/json'
      };

      notify(metadata, configMultipleHeader).then(function (body) {
        const jsonBody = JSON.parse(body);
        assert.ok(`New package published: * ${metadata.name}*` === jsonBody.message,
          'Body notify message should be equal');
        done();
      }, function (err) {
        assert.fail(err);
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

        notify(metadata, multipleNotificationsEndpoint).then(function (body) {
          const jsonBody = JSON.parse(body);
          assert.ok(`New package published: * ${metadata.name}*` === jsonBody.message,
            'Body notify message should be equal');
          done();
        }, function (err) {
          assert.fail(err);
          done();
        });
      }
    );

    test('notification should fails', done => {
      const metadata = {
        name: "pkg-test"
      };
      const configFail = _.cloneDeep(config);
      configFail.notify.endpoint = "http://localhost:55550/api/notify/bad";

      notify(metadata, configFail).then(function () {
        assert.equal(false, 'This service should fails with status code 400');
        done();
      }, function (err) {
        assert.ok('Bad Request' === err, 'The error message should be "Bad Request');
        done();
      });
    });

  });
}
