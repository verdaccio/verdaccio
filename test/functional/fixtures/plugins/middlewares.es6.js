/* eslint-disable @typescript-eslint/explicit-member-accessibility */

/**
 * Original plugin in ES6
 *
 * class PluginES6 {

  constructor (config, stuff) {
    this._config = config;
  }

  register_middlewares(app, auth, storage) {
    const {message} = this._config;

    app.get('/test/route/es6', function (req, res, next) {
      res.status(200);

      return next({ok: message})
    });
  }

}

 export default PluginES6;

 */

// this file has been transpiled with babel.js

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class PluginES6 {

  constructor(config, stuff) {
    this._config = config;
    this._logger = stuff.logger;
  }

  register_middlewares(app, /* auth, storage */) {
    const message = this._config.message;


    app.get('/test/route/es6', function (req, res, next) {
      res.status(200);

      return next({ ok: message });
    });
  }

}

exports.default = PluginES6;

