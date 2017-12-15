'use strict';

const assert = require('assert');
const _ = require('lodash');
const notify = require('../../../src/lib/notify').notify;

module.exports = function() {
  const express = process.express;

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

  describe('notifications', function () {

    before(function () {
      express.post('/api/notify', function (req, res) {
        res.send(req.body);
      });
      express.post('/api/notify/bad', function (req, res) {
        res.status(400);
        res.send('bad response');
      });
    });

    it('notification should be send', function (done) {
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

    it('notification should be send single header', function (done) {
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

    it('notification should be send multiple notifications endpoints', function (done) {
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
        body.forEach(function(notification) {
          const jsonBody = JSON.parse(notification);
          assert.ok(`New package published: * ${metadata.name}*` === jsonBody.message,
            'Body notify message should be equal');
        });
        done();
      }, function (err) {
        assert.fail(err);
        done();
      });
    });

    it('notification should fails', function (done) {
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
};
