'use strict';

const arrify = require('arrify');
const git = require('simple-git/promise');
const matcher = require('matcher');

const getFiles = cwd => {
  return git(cwd)
    .silent(true)
    .status()
    .then(({ files }) => files);
};

const isMatch = (obj, patterns) => {
  return Object.keys(obj).every(key => {
    if (patterns[key].toString() === '*') {
      return true;
    }

    return matcher(Array.of(obj[key]), patterns[key]).length >= 1;
  });
};

module.exports = ({
  cwd = process.cwd(),
  path = '*',
  index = '*',
  workingTree = '*',
} = {}) => {
  const patterns = {
    path: arrify(path),
    index: Array.from(index),
    workingTree: Array.from(workingTree),
  };

  return getFiles(cwd)
    .then(files => {
      return files.map(({ path, index, working_dir: workingTree }) => ({
        path,
        index,
        workingTree,
      }));
    })
    .then(files => files.filter(x => isMatch(x, patterns)));
};
