---
id: dev-plugins
title: Developing Plugins
---
There are many ways to extend `verdaccio`, currently we only support `authentication plugins`

## Authentication Plugins

This section will describe how it looks like a Verdaccio plugin in a ES5 way. Basically we have to return an object with a single method called `authenticate` that will recieve 3 arguments (`user, password, callback`). Once the authentication has been executed there is 2 options to give a response to `verdaccio`.

##### OnError

Either something bad happened or auth was unsuccessful.

    callback(null, false)
    

##### OnSuccess

The auth was successful.

`groups` is an array of strings where the user is part of.

     callback(null, groups);
    

### Example

```javascript
function Auth(config, stuff) {
  var self = Object.create(Auth.prototype);
  self._users = {};

  // config for this module
  self._config = config;

  // verdaccio logger
  self._logger = stuff.logger;

  // pass verdaccio logger to ldapauth
  self._config.client_options.log = stuff.logger;

  return self;
}

Auth.prototype.authenticate = function (user, password, callback) {
  var LdapClient = new LdapAuth(self._config.client_options);
  ....
  LdapClient.authenticate(user, password, function (err, ldapUser) {
    ...
    var groups;
     ...
    callback(null, groups);
  });
};

module.exports = Auth;
```

## Storage Plugins

// in progress

## Middleware Integration

// in progress