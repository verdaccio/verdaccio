var assert = require('assert')
var Semver = require('semver')
var URL    = require('url')
var Logger = require('./logger')

module.exports.validate_package = function(name) {
  name = name.split('/', 2)
  if (name.length === 1) {
    // normal package
    return module.exports.validate_name(name[0])
  } else {
    // scoped package
    return name[0][0] === '@'
        && module.exports.validate_name(name[0].slice(1))
        && module.exports.validate_name(name[1])
  }
}

// from normalize-package-data/lib/fixer.js
module.exports.validate_name = function(name) {
  if (typeof(name) !== 'string') return false
  name = name.toLowerCase()

  // all URL-safe characters and "@" for issue #75
  if (!name.match(/^[-a-zA-Z0-9_.!~*'()@]+$/)
   || name.charAt(0) === '.' // ".bin", etc.
   || name.charAt(0) === '-' // "-" is reserved by couchdb
   || name === 'node_modules'
   || name === '__proto__'
   || name === 'package.json'
   || name === 'favicon.ico'
  ) {
    return false
  } else {
    return true
  }
}

module.exports.is_object = function(obj) {
  return typeof(obj) === 'object' && obj !== null && !Array.isArray(obj)
}

module.exports.validate_metadata = function(object, name) {
  assert(module.exports.is_object(object), 'not a json object')
  assert.equal(object.name, name)

  if (!module.exports.is_object(object['dist-tags'])) {
    object['dist-tags'] = {}
  }

  if (!module.exports.is_object(object['versions'])) {
    object['versions'] = {}
  }

  return object
}

module.exports.filter_tarball_urls = function(pkg, req, config) {
  function filter(_url) {
    if (!req.headers.host) return _url

    var filename = URL.parse(_url).pathname.replace(/^.*\//, '')

    if (config.url_prefix != null) {
      var result = config.url_prefix.replace(/\/$/, '')
    } else {
      var result = req.protocol + '://' + req.headers.host
    }

    return result + '/' + pkg.name.replace(/\//g, '%2f') + '/-/' + filename
  }

  for (var ver in pkg.versions) {
    var dist = pkg.versions[ver].dist
    if (dist != null && dist.tarball != null) {
      //dist.__sinopia_orig_tarball = dist.tarball
      dist.tarball = filter(dist.tarball)
    }
  }
  return pkg
}

module.exports.tag_version = function(data, version, tag) {
  if (tag) {
    if (data['dist-tags'][tag] !== version) {
      if (Semver.parse(version, true)) {
        // valid version - store
        data['dist-tags'][tag] = version
        return true
      }
    }
    Logger.logger.warn({ver: version, tag: tag}, 'ignoring bad version @{ver} in @{tag}')
    if (tag && data['dist-tags'][tag]) {
      delete data['dist-tags'][tag]
    }
  }
  return false
}

// gets version from a package object taking into account semver weirdness
module.exports.get_version = function(object, version) {
  if (object.versions[version] != null) return object.versions[version]

  try {
    version = Semver.parse(version, true)
    for (var k in object.versions) {
      if (version.compare(Semver.parse(k, true)) === 0) {
        return object.versions[k]
      }
    }
  } catch (err) {
    return undefined
  }
}

module.exports.parse_address = function parse_address(addr) {
  //
  // Allow:
  //
  //  - https:localhost:1234        - protocol + host + port
  //  - localhost:1234              - host + port
  //  - 1234                        - port
  //  - http::1234                  - protocol + port
  //  - https://localhost:443/      - full url + https
  //  - http://[::1]:443/           - ipv6
  //  - unix:/tmp/http.sock         - unix sockets
  //  - https://unix:/tmp/http.sock - unix sockets (https)
  //
  // TODO: refactor it to something more reasonable?
  //
  //        protocol :  //      (  host  )|(    ipv6     ):  port  /
  var m = /^((https?):(\/\/)?)?((([^\/:]*)|\[([^\[\]]+)\]):)?(\d+)\/?$/.exec(addr)

  if (m) return {
    proto: m[2] || 'http',
    host:  m[6] || m[7] || 'localhost',
    port:  m[8] || '4873',
  }

  var m = /^((https?):(\/\/)?)?unix:(.*)$/.exec(addr)

  if (m) return {
    proto: m[2] || 'http',
    path:  m[4],
  }

  return null
}

// function filters out bad semver versions and sorts the array
module.exports.semver_sort = function semver_sort(array) {
  return array
        .filter(function(x) {
          if (!Semver.parse(x, true)) {
            Logger.logger.warn( {ver: x}, 'ignoring bad version @{ver}' )
            return false
          }
          return true
        })
        .sort(Semver.compareLoose)
        .map(String)
}

// flatten arrays of tags
module.exports.normalize_dist_tags = function (data) {
  var sorted

  if (!data['dist-tags'].latest) {
    // overwrite latest with highest known version based on semver sort
    sorted = module.exports.semver_sort(Object.keys(data.versions))
    if (sorted && sorted.length) {
        data['dist-tags'].latest = sorted.pop()
    }
  }

  for (var tag in data['dist-tags']) {
    if (Array.isArray(data['dist-tags'][tag])) {
      if (data['dist-tags'][tag].length) {
        // sort array
        sorted = module.exports.semver_sort(data['dist-tags'][tag])
        if (sorted.length) {
            // use highest version based on semver sort
            data['dist-tags'][tag] = sorted.pop()
        }

      } else {
        delete data['dist-tags'][tag]
      }
    } else if (typeof data['dist-tags'][tag] === 'string') {
      if (!Semver.parse(data['dist-tags'][tag], true)) {
        // if the version is invalid, delete the dist-tag entry
        delete data['dist-tags'][tag]
      }
    }
  }
}
