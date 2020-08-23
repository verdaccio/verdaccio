#!/usr/bin/env node
'use strict';
var fs = require('fs');
var getPkgRepo = require('./');
var meow = require('meow');
var through = require('through2');
var util = require('util');

var cli = meow({
  help: [
    'Practice writing repoitory url or validate the repository in a package.json file.',
    'If used without specifying a package.json file path, you will enter an interactive shell.',
    'Otherwise, the repository info in package.json is printed.',
    '',
    'Usage',
    '  get-pkg-repo',
    '  get-pkg-repo <path> [<path> ...]',
    '  cat <path> | get-pkg-repo',
    '',
    'Examples',
    '  get-pkg-repo',
    '  get-pkg-repo package.json',
    '  cat package.json | get-pkg-repo --fix-typo',
    '',
    'Options',
    '  -f, --fix-typo    Fix your typical typos automatically'
  ]
});

var fixTypo = cli.flags.fixTypo;
var input = cli.input;

if (process.stdin.isTTY) {
  if (input.length > 0) {
    input.forEach(function(path) {
      var repo;
      fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
          console.error(err);
          return;
        }

        try {
          repo = getPkgRepo(data, fixTypo);
          console.log(repo);
        } catch (e) {
          console.error(path + ': ' + e.toString());
        }
      });
    });
  } else {
    process.stdin
      .pipe(through.obj(function(chunk, enc, cb) {
        var repo;
        var pkgData = {
          repository: chunk.toString()
        };

        try {
          repo = getPkgRepo(pkgData, fixTypo);
          cb(null, util.format(repo) + '\n');
        } catch (e) {
          console.error(e.toString());
          cb();
        }
      }))
      .pipe(process.stdout);
  }
} else {
  process.stdin
    .pipe(through.obj(function(chunk, enc, cb) {
      var repo;
      try {
        repo = getPkgRepo(chunk.toString(), fixTypo);
      } catch (e) {
        console.error(e.toString());
        process.exit(1);
      }
      cb(null, util.format(repo) + '\n');
    }))
    .pipe(process.stdout);
}
