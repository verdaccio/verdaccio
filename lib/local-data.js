var fs   = require('fs')
var Path = require('path')

module.exports = LocalData

function LocalData(path) {
  var self = Object.create(LocalData.prototype)
  self.path = path
  try {
    self.data = JSON.parse(fs.readFileSync(self.path, 'utf8'))
  } catch(_) {
    self.data = { list: [] }
  }
  return self
}

LocalData.prototype.add = function(name) {
  if (this.data.list.indexOf(name) === -1) {
    this.data.list.push(name)
    this.sync()
  }
}

LocalData.prototype.remove = function(name) {
  var i = this.data.list.indexOf(name)
  if (i !== -1) {
    this.data.list.splice(i, 1)
  }

  this.sync()
}

LocalData.prototype.get = function() {
  return this.data.list
}

LocalData.prototype.sync = function() {
  // Uses sync to prevent ugly race condition
  try {
    require('mkdirp').sync(Path.dirname(this.path))
  } catch(err) {}
  fs.writeFileSync(this.path, JSON.stringify(this.data))
}

