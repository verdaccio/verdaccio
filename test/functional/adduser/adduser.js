'use strict';

import Server from '../lib/server';
const fs = require('fs');
const path = require('path');

module.exports = function() {
  const server = new Server('http://localhost:55551/');

  describe('npm adduser', function() {
    const user = String(Math.random());
    const pass = String(Math.random());
    before(function() {
      return server.auth(user, pass)
               .status(201)
               .body_ok(/user .* created/);
    });

    it('should create new user', function() {});

    it('should log in', function() {
      return server.auth(user, pass)
               .status(201)
               .body_ok(/you are authenticated as/);
    });

    it('should not register more users', function() {
      return server.auth(String(Math.random()), String(Math.random()))
               .status(409)
               .body_error(/maximum amount of users reached/);
    });
  });

  describe('should adduser created with htpasswd', function() {
    const user = 'preexisting';
    const pass = 'preexisting';

    before(function() {
      return fs.appendFileSync(
        path.join(__dirname, '../store/test-storage', '.htpasswd'),
        'preexisting:$apr1$4YSboUa9$yVKjE7.PxIOuK3M4D7VjX.'
      );
    });

    it('should log in', function() {
      return server.auth(user, pass)
               .status(201)
               .body_ok(/you are authenticated as/);
    });
  });
};
