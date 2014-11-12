var lunr = require('lunr')

function Search() {
  var self = Object.create(Search.prototype)
  self.index = lunr(function() {
    this.field('name'        , { boost: 10 })
    this.field('description' , { boost:  4 })
    this.field('author'      , { boost:  6 })
    this.field('readme')
  })
  return self
}

Search.prototype.query = function(q) {
  return this.index.search(q)
}

Search.prototype.add = function(package) {
  this.index.add({
    id:           package.name,
    name:         package.name,
    description:  package.description,
    author:       package._npmUser ? package._npmUser.name : '???',
  })
},

Search.prototype.remove = function(name) {
  this.index.remove({ id: name })
}

Search.prototype.reindex = function() {
  var self = this
  this.storage.get_local(function(err, packages) {
    if (err) throw err // that function shouldn't produce any
    var i = packages.length
    while (i--) {
      self.add(packages[i])
    }
  })
}

Search.prototype.configureStorage = function(storage) {
  this.storage = storage
  this.reindex()
}

module.exports = Search()

