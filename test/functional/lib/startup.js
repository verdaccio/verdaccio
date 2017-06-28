'use strict';

const fork = require('child_process').fork;
const express = require('express');
const rimRaf = require('rimraf');
const Server = require('./server');

const forks = process.forks = [];
process.server = new Server('http://localhost:55551/');
process.server2 = new Server('http://localhost:55552/');
process.server3 = new Server('http://localhost:55553/');
process.express = express();
process.express.listen(55550);

module.exports.start = function(dir, conf) {
  return new Promise(function(resolve, reject) {
    rimRaf(__dirname + '/../' + dir, function() {
      const filteredArguments = process.execArgv = process.execArgv.filter(function(x) {
        // filter out --debug-brk and --inspect-brk since Node7
        return (x.indexOf('--debug-brk') === -1  && x.indexOf('--inspect-brk') === -1);
      });

      const childFork = fork(__dirname + '/../../../bin/verdaccio',
        ['-c', __dirname + '/../' + conf],
        {
          silent: !process.env.TRAVIS
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

      process.execArgv = filteredArguments;
    });
  });
};

process.on('exit', function() {
  if (forks[0]) {
    forks[0].kill();
  }
  if (forks[1]) {
    forks[1].kill();
  }
  if (forks[2]) {
    forks[2].kill();
  }
});
