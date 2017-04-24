'use strict';

const fs = require('fs');
const Path = require('path');

 class LocalData {

   constructor(path) {
    this.path = path;
    try {
      this.data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
    } catch(_) {
      this.data = {list: []};
    }
  }

  add(name) {
    if (this.data.list.indexOf(name) === -1) {
      this.data.list.push(name);
      this.sync();
    }
  }

  remove(name) {
    const i = this.data.list.indexOf(name);
    if (i !== -1) {
      this.data.list.splice(i, 1);
    }
    this.sync();
  }

  get() {
    return this.data.list;
  }

  sync() {
    // Uses sync to prevent ugly race condition
    try {
      require('mkdirp').sync(Path.dirname(this.path));
    } catch(err) {}
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

}

module.exports = LocalData;
