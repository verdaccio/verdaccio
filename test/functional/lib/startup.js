'use strict';

import express from 'express';
import Server from './server';

const _ = require('lodash');
const fork = require('child_process').fork;
const bodyParser = require('body-parser');

const rimRaf = require('rimraf');
const path = require('path');

const forks = process.forks = [];
process.server = new Server('http://localhost:55551/');
process.server2 = new Server('http://localhost:55552/');
process.server3 = new Server('http://localhost:55553/');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
process.express = app;
process.express.listen(55550);

module.exports.start = function(dir, conf) {
  return new Promise(function(resolve, reject) {
    const storageDir = path.join(__dirname, `/../${dir}`);
    const configPath = path.join(__dirname, '../', conf);

    rimRaf(storageDir, function(err) {
      if(_.isNil(err) === false) {
        reject(err);
      }
      const filteredArguments = process.execArgv = process.execArgv.filter(function(x) {
        // filter out --debug-brk and --inspect-brk since Node7
        return (x.indexOf('--debug-brk') === -1  && x.indexOf('--inspect-brk') === -1);
      });
      const url = path.join(__dirname, '/../../helper/verdaccio-test');
      const childFork = fork(url,
        ['-c', configPath],
        {
          silent: !process.env.TRAVIS,
          // silent: false,
          env: {
            BABEL_ENV: 'registry'
          }
        }
      );

      forks.push(childFork);

      childFork.on('message', function(msg) {
        if ('verdaccio_started' in msg) {
          resolve();
        }
      });

      childFork.on('error', function(err) {
        reject(err);
      });

      childFork.on('disconnect', function(err) {
        reject(err);
      });

      childFork.on('exit', function(err) {
        reject(err);
      });

      process.execArgv = filteredArguments;
    });
  });
};

process.on('exit', function() {
  if (_.isNil(forks[0]) === false) {
    forks[0].kill();
  }
  if (_.isNil(forks[1]) === false) {
    forks[1].kill();
  }
  if (_.isNil(forks[2]) === false) {
    forks[2].kill();
  }
});
