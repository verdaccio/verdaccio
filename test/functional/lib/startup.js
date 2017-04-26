'use strict';

const fork = require('child_process').fork;
const express = require('express');
const rimraf = require('rimraf');
const Server = require('./server');

const forks = process.forks = [];
process.server = Server('http://localhost:55551/');
process.server2 = Server('http://localhost:55552/');
process.express = express();
process.express.listen(55550);

module.exports.start = function(dir, conf) {
  return new Promise(function(resolve, reject) {
    rimraf(__dirname + '/../' + dir, function() {
      // filter out --debug-brk
      let oldArgv = process.execArgv;
      process.execArgv = process.execArgv.filter(function(x) {
        return x !== '--debug-brk';
      });

      const f = fork(__dirname + '/../../../bin/verdaccio'
        , ['-c', __dirname + '/../' + conf]
        , {silent: !process.env.TRAVIS}
      );
      forks.push(f);
      f.on('message', function(msg) {
        if ('verdaccio_started' in msg) {
          resolve();
        }
      });
      f.on('error', function(err) {
        reject(err);
      });
      process.execArgv = oldArgv;
    });
  });
};

process.on('exit', function() {
  if (forks[0]) forks[0].kill();
  if (forks[1]) forks[1].kill();
});
