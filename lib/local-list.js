var fs = require('fs')

module.exports = LocalList

function LocalList(path) {
  var self = Object.create(LocalList.prototype)
  self.path = path
  try {
    self.list = JSON.parse(fs.readFileSync(self.path, 'utf8')).list
  } catch(_) {
    self.list = []
  }
  return self
}

LocalList.prototype.add = function(name) {
  if (this.list.indexOf(name) === -1) {
    this.list.push(name)
    this.sync()
  }
}

LocalList.prototype.remove = function(name) {
  var i = this.list.indexOf(name)
  if (i !== -1) {
    this.list.splice(i, 1)
  }
    
  this.sync()
}

LocalList.prototype.get = function() {
  return this.list
}

LocalList.prototype.sync = function() {
  // Uses sync to prevent ugly race condition
  fs.writeFileSync(this.path, JSON.stringify({ list: this.list }))
}

