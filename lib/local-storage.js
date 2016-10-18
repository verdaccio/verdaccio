var assert     = require('assert')
var async      = require('async')
var Crypto     = require('crypto')
var fs         = require('fs')
var Error      = require('http-errors')
var Path       = require('path')
var Stream     = require('readable-stream')
var URL        = require('url')
var fs_storage = require('./local-fs')
var Logger     = require('./logger')
var Search     = require('./search')
var MyStreams  = require('./streams')
var Utils      = require('./utils')
var info_file  = 'package.json'

//
// Implements Storage interface
// (same for storage.js, local-storage.js, up-storage.js)
//
function Storage(config) {
  var self = Object.create(Storage.prototype)
  self.config = config
  self.logger = Logger.logger.child({ sub: 'fs' })
  return self
}

// returns the minimal package file
function get_boilerplate(name) {
  return {
    // standard things
    name: name,
    versions: {},
    'dist-tags': {},

    // our own object
    '_distfiles': {},
    '_attachments': {},
    '_uplinks': {},
  }
}

Storage.prototype._internal_error = function(err, file, message) {
  this.logger.error( { err: err, file: file }
                   , message + ' @{file}: @{!err.message}' )
  return Error[500]()
}

Storage.prototype.add_package = function(name, info, callback) {
  var storage = this.storage(name)
  if (!storage) return callback( Error[404]('this package cannot be added') )

  storage.create_json(info_file, get_boilerplate(name), function(err) {
    if (err && err.code === 'EEXISTS') {
      return callback( Error[409]('this package is already present') )
    }

    var latest = info['dist-tags'].latest
    if (latest && info.versions[latest]) {
      Search.add(info.versions[latest])
    }
    callback()
  })
}

Storage.prototype.remove_package = function(name, callback) {
  var self = this
  self.logger.info( { name: name }
                  , 'unpublishing @{name} (all)')

  var storage = self.storage(name)
  if (!storage) return callback( Error[404]('no such package available') )

  storage.read_json(info_file, function(err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        return callback( Error[404]('no such package available') )
      } else {
        return callback(err)
      }
    }
    self._normalize_package(data)

    storage.unlink(info_file, function(err) {
      if (err) return callback(err)

      var files = Object.keys(data._attachments)

      function unlinkNext(cb) {
        if (files.length === 0) return cb()

        var file = files.shift()
        storage.unlink(file, function() {
          unlinkNext(cb)
        })
      }

      unlinkNext(function() {
        // try to unlink the directory, but ignore errors because it can fail
        storage.rmdir('.', function(err) {
          callback(err)
        })
      })
    })
  })

  Search.remove(name)
  this.config.localList.remove(name)
}

Storage.prototype._read_create_package = function(name, callback) {
  var self = this
  var storage = self.storage(name)
  if (!storage) {
    var data = get_boilerplate(name)
    self._normalize_package(data)
    return callback(null, data)
  }
  storage.read_json(info_file, function(err, data) {
    // TODO: race condition
    if (err) {
      if (err.code === 'ENOENT') {
        // if package doesn't exist, we create it here
        data = get_boilerplate(name)
      } else {
        return callback(self._internal_error(err, info_file, 'error reading'))
      }
    }
    self._normalize_package(data)
    callback(null, data)
  })
}

// synchronize remote package info with the local one
// TODO: readfile called twice
Storage.prototype.update_versions = function(name, newdata, callback) {
  var self = this
  self._read_create_package(name, function(err, data) {
    if (err) return callback(err)

    var change = false
    for (var ver in newdata.versions) {
      if (data.versions[ver] == null) {
        var verdata = newdata.versions[ver]

        // we don't keep readmes for package versions,
        // only one readme per package
        delete verdata.readme

        change = true
        data.versions[ver] = verdata

        if (verdata.dist && verdata.dist.tarball) {
          var filename = URL.parse(verdata.dist.tarball).pathname.replace(/^.*\//, '')
          // we do NOT overwrite any existing records
          if (data._distfiles[filename] == null) {
            var hash = data._distfiles[filename] = {
              url: verdata.dist.tarball,
              sha: verdata.dist.shasum,
            }

            if (verdata._sinopia_uplink) {
              // if we got this information from a known registry,
              // use the same protocol for the tarball
              //
              // see https://github.com/rlidwka/sinopia/issues/166
              var tarball_url = URL.parse(hash.url)
              var uplink_url  = URL.parse(self.config.uplinks[verdata._sinopia_uplink].url)
              if (uplink_url.host === tarball_url.host) {
                tarball_url.protocol = uplink_url.protocol
                hash.registry = verdata._sinopia_uplink
                hash.url = URL.format(tarball_url)
              }
            }
          }
        }
      }
    }
    for (var tag in newdata['dist-tags']) {
      if (!data['dist-tags'][tag] || data['dist-tags'][tag] !== newdata['dist-tags'][tag]) {
        change = true
        data['dist-tags'][tag] = newdata['dist-tags'][tag]
      }
    }
    for (var up in newdata._uplinks) {
      var need_change = !Utils.is_object(data._uplinks[up])
                     || newdata._uplinks[up].etag !== data._uplinks[up].etag
                     || newdata._uplinks[up].fetched !== data._uplinks[up].fetched

      if (need_change) {
        change = true
        data._uplinks[up] = newdata._uplinks[up]
      }
    }
    if (newdata.readme !== data.readme) {
      data.readme = newdata.readme
      change = true
    }

    if (change) {
      self.logger.debug('updating package info')
      self._write_package(name, data, function(err) {
        callback(err, data)
      })
    } else {
      callback(null, data)
    }
  })
}

Storage.prototype.add_version = function(name, version, metadata, tag, callback) {
  var self = this
  self.update_package(name, function updater(data, cb) {
    // keep only one readme per package
    data.readme = metadata.readme
    delete metadata.readme

    if (data.versions[version] != null) {
      return cb( Error[409]('this version already present') )
    }

    // if uploaded tarball has a different shasum, it's very likely that we have some kind of error
    if (Utils.is_object(metadata.dist) && typeof(metadata.dist.tarball) === 'string') {
      var tarball = metadata.dist.tarball.replace(/.*\//, '')
      if (Utils.is_object(data._attachments[tarball])) {
        if (data._attachments[tarball].shasum != null && metadata.dist.shasum != null) {
          if (data._attachments[tarball].shasum != metadata.dist.shasum) {
            return cb( Error[400]('shasum error, '
                                + data._attachments[tarball].shasum
                                + ' != ' + metadata.dist.shasum) )
          }
        }

        data._attachments[tarball].version = version
      }
    }

    data.versions[version] = metadata
    Utils.tag_version(data, version, tag)
    self.config.localList.add(name)
    cb()
  }, callback)
}

Storage.prototype.merge_tags = function(name, tags, callback) {
  var self = this

  self.update_package(name, function updater(data, cb) {
    for (var t in tags) {
      if (tags[t] === null) {
        delete data['dist-tags'][t]
        continue
      }

      if (data.versions[tags[t]] == null) {
        return cb( Error[404]("this version doesn't exist") )
      }

      Utils.tag_version(data, tags[t], t)
    }
    cb()
  }, callback)
}

Storage.prototype.replace_tags = function(name, tags, callback) {
  var self = this

  self.update_package(name, function updater(data, cb) {
    data['dist-tags'] = {}

    for (var t in tags) {
      if (tags[t] === null) {
        delete data['dist-tags'][t]
        continue
      }

      if (data.versions[tags[t]] == null) {
        return cb( Error[404]("this version doesn't exist") )
      }

      Utils.tag_version(data, tags[t], t)
    }
    cb()
  }, callback)
}

// currently supports unpublishing only
Storage.prototype.change_package = function(name, metadata, revision, callback) {
  var self = this

  if (!Utils.is_object(metadata.versions) || !Utils.is_object(metadata['dist-tags'])) {
    return callback( Error[422]('bad data') )
  }

  self.update_package(name, function updater(data, cb) {
    for (var ver in data.versions) {
      if (metadata.versions[ver] == null) {
        self.logger.info( { name: name, version: ver }
                        , 'unpublishing @{name}@@{version}')
        delete data.versions[ver]

        for (var file in data._attachments) {
          if (data._attachments[file].version === ver) {
            delete data._attachments[file].version
          }
        }
      }
    }
    data['dist-tags'] = metadata['dist-tags']
    cb()
  }, function(err) {
    if (err) return callback(err)
    callback()
  })
}

Storage.prototype.remove_tarball = function(name, filename, revision, callback) {
  assert(Utils.validate_name(filename))
  var self = this

  self.update_package(name, function updater(data, cb) {
    if (data._attachments[filename]) {
      delete data._attachments[filename]
      cb()
    } else {
      cb(Error[404]('no such file available'))
    }
  }, function(err) {
    if (err) return callback(err)
    var storage = self.storage(name)
    if (storage) storage.unlink(filename, callback)
  })
}

Storage.prototype.add_tarball = function(name, filename) {
  assert(Utils.validate_name(filename))

  var stream = MyStreams.UploadTarballStream()
  var _transform = stream._transform
  var length = 0
  var shasum = Crypto.createHash('sha1')

  stream.abort = stream.done = function(){}

  stream._transform = function(data) {
    shasum.update(data)
    length += data.length
    _transform.apply(stream, arguments)
  }

  var self = this
  if (name === info_file || name === '__proto__') {
    process.nextTick(function() {
      stream.emit('error', Error[403]("can't use this filename"))
    })
    return stream
  }

  var storage = self.storage(name)
  if (!storage) {
    process.nextTick(function() {
      stream.emit('error', Error[404]("can't upload this package"))
    })
    return stream
  }

  var wstream = storage.write_stream(filename)

  wstream.on('error', function(err) {
    if (err.code === 'EEXISTS') {
      stream.emit('error', Error[409]('this tarball is already present'))
    } else if (err.code === 'ENOENT') {
      // check if package exists to throw an appropriate message
      self.get_package(name, function(_err, res) {
        if (_err) {
          stream.emit('error', _err)
        } else {
          stream.emit('error', err)
        }
      })
    } else {
      stream.emit('error', err)
    }
  })

  wstream.on('open', function() {
    // re-emitting open because it's handled in storage.js
    stream.emit('open')
  })
  wstream.on('success', function() {
    self.update_package(name, function updater(data, cb) {
      data._attachments[filename] = {
        shasum: shasum.digest('hex'),
      }
      cb()
    }, function(err) {
      if (err) {
        stream.emit('error', err)
      } else {
        stream.emit('success')
      }
    })
  })
  stream.abort = function() {
    wstream.abort()
  }
  stream.done = function() {
    if (!length) {
      stream.emit('error', Error[422]('refusing to accept zero-length file'))
      wstream.abort()
    } else {
      wstream.done()
    }
  }
  stream.pipe(wstream)

  return stream
}

Storage.prototype.get_tarball = function(name, filename, callback) {
  assert(Utils.validate_name(filename))
  var self = this

  var stream = MyStreams.ReadTarballStream()
  stream.abort = function() {
    if (rstream) rstream.abort()
  }

  var storage = self.storage(name)
  if (!storage) {
    process.nextTick(function() {
      stream.emit('error', Error[404]('no such file available'))
    })
    return stream
  }

  var rstream = storage.read_stream(filename)
  rstream.on('error', function(err) {
    if (err && err.code === 'ENOENT') {
      stream.emit('error', Error(404, 'no such file available'))
    } else {
      stream.emit('error', err)
    }
  })
  rstream.on('content-length', function(v) {
    stream.emit('content-length', v)
  })
  rstream.on('open', function() {
    // re-emitting open because it's handled in storage.js
    stream.emit('open')
    rstream.pipe(stream)
  })
  return stream
}

Storage.prototype.get_package = function(name, options, callback) {
  if (typeof(options) === 'function') callback = options, options = {}

  var self = this
  var storage = self.storage(name)
  if (!storage) return callback( Error[404]('no such package available') )

  storage.read_json(info_file, function(err, result) {
    if (err) {
      if (err.code === 'ENOENT') {
        return callback( Error[404]('no such package available') )
      } else {
        return callback(self._internal_error(err, info_file, 'error reading'))
      }
    }
    self._normalize_package(result)
    callback(err, result)
  })
}

// walks through each package and calls `on_package` on them
Storage.prototype._each_package = function (on_package, on_end) {
  var self = this
  var storages = {}

  storages[self.config.storage] = true

  if (self.config.packages) {
    Object.keys(self.packages || {}).map(function (pkg) {
      if (self.config.packages[pkg].storage) {
        storages[self.config.packages[pkg].storage] = true
      }
    })
  }

  var base = Path.dirname(self.config.self_path);

  async.eachSeries(Object.keys(storages), function (storage, cb) {
    fs.readdir(Path.resolve(base, storage), function (err, files) {
      if (err) return cb(err)

      async.eachSeries(files, function (file, cb) {
        if (file.match(/^@/)) {
          // scoped
          fs.readdir(Path.resolve(base, storage, file), function (err, files) {
            if (err) return cb(err)

            async.eachSeries(files, function (file2, cb) {
              if (Utils.validate_name(file2)) {
                on_package({
                  name: file + '/' + file2,
                  path: Path.resolve(base, storage, file, file2),
                }, cb)
              } else {
                cb()
              }
            }, cb)
          })
        } else if (Utils.validate_name(file)) {
          on_package({
            name: file,
            path: Path.resolve(base, storage, file)
          }, cb)
        } else {
          cb()
        }
      }, cb)
    })
  }, on_end)
}

//
// This function allows to update the package thread-safely
//
// Arguments:
// - name - package name
// - updateFn - function(package, cb) - update function
// - callback - callback that gets invoked after it's all updated
//
// Algorithm:
// 1. lock package.json for writing
// 2. read package.json
// 3. updateFn(pkg, cb), and wait for cb
// 4. write package.json.tmp
// 5. move package.json.tmp package.json
// 6. callback(err?)
//
Storage.prototype.update_package = function(name, updateFn, _callback) {
  var self = this
  var storage = self.storage(name)
  if (!storage) return _callback( Error[404]('no such package available') )
  storage.lock_and_read_json(info_file, function(err, json) {
    var locked = false

    // callback that cleans up lock first
    function callback(err) {
      var _args = arguments
      if (locked) {
        storage.unlock_file(info_file, function () {
          // ignore any error from the unlock
          _callback.apply(err, _args)
        })
      } else {
        _callback.apply(null, _args)
      }
    }

    if (!err) {
      locked = true
    }

    if (err) {
      if (err.code === 'EAGAIN') {
        return callback( Error[503]('resource temporarily unavailable') )
      } else if (err.code === 'ENOENT') {
        return callback( Error[404]('no such package available') )
      } else {
        return callback(err)
      }
    }

    self._normalize_package(json)
    updateFn(json, function(err) {
      if (err) return callback(err)

      self._write_package(name, json, callback)
    })
  })
}

Storage.prototype.search = function(startkey, options) {
  var self = this

  var stream = new Stream.PassThrough({ objectMode: true })

  self._each_package(function on_package(item, cb) {
    fs.stat(item.path, function(err, stats) {
      if (err) return cb(err)

      if (stats.mtime > startkey) {
        self.get_package(item.name, options, function(err, data) {
          if (err) return cb(err)

          var versions = Utils.semver_sort(Object.keys(data.versions))
          var latest = data['dist-tags'] && data['dist-tags'].latest ? data['dist-tags'].latest : versions.pop()

          if (data.versions[latest]) {
            stream.push({
              name           : data.versions[latest].name,
              description    : data.versions[latest].description,
              'dist-tags'    : { latest: latest },
              maintainers    : data.versions[latest].maintainers ||
                                 [ data.versions[latest]._npmUser ].filter(Boolean),
              author         : data.versions[latest].author,
              repository     : data.versions[latest].repository,
              readmeFilename : data.versions[latest].readmeFilename || '',
              homepage       : data.versions[latest].homepage,
              keywords       : data.versions[latest].keywords,
              bugs           : data.versions[latest].bugs,
              license        : data.versions[latest].license,
              time           : { modified: item.time ? new Date(item.time).toISOString() : undefined },
              versions       : {},
            })
          }

          cb()
        })
      } else {
        cb()
      }
    })
  }, function on_end(err) {
    if (err) return stream.emit('error', err)
    stream.end()
  })

  return stream
}

Storage.prototype._normalize_package = function(pkg) {
  ;['versions', 'dist-tags', '_distfiles', '_attachments', '_uplinks'].forEach(function(key) {
    if (!Utils.is_object(pkg[key])) pkg[key] = {}
  })
  if (typeof(pkg._rev) !== 'string') pkg._rev = '0-0000000000000000'

  // normalize dist-tags
  Utils.normalize_dist_tags(pkg)
}

Storage.prototype._write_package = function(name, json, callback) {

  // calculate revision a la couchdb
  if (typeof(json._rev) !== 'string') json._rev = '0-0000000000000000'
  var rev = json._rev.split('-')
  json._rev = ((+rev[0] || 0) + 1) + '-' + Crypto.pseudoRandomBytes(8).toString('hex')

  var storage = this.storage(name)
  if (!storage) return callback()
  storage.write_json(info_file, json, callback)
}

Storage.prototype.storage = function(package) {
  var path = this.config.get_package_spec(package).storage
  if (path == null) path = this.config.storage
  if (path == null || path === false) {
    this.logger.debug( { name: package }
                     , 'this package has no storage defined: @{name}' )
    return null
  }
  return Path_Wrapper(
    Path.join(
      Path.resolve(Path.dirname(this.config.self_path || ''), path),
      package
    )
  )
}

var Path_Wrapper = (function() {
  // a wrapper adding paths to fs_storage methods
  function Wrapper(path) {
    var self = Object.create(Wrapper.prototype)
    self.path = path
    return self
  }

  for (var i in fs_storage) {
    if (fs_storage.hasOwnProperty(i)) {
      Wrapper.prototype[i] = wrapper(i)
    }
  }

  function wrapper(method) {
    return function(/*...*/) {
      var args = Array.prototype.slice.apply(arguments)
      args[0] = Path.join(this.path, args[0] || '')
      return fs_storage[method].apply(null, args)
    }
  }

  return Wrapper
})()

module.exports = Storage

