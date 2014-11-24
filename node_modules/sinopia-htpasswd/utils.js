var crypto = require('crypto')
var fs = require('fs')

try {
  // optional, won't be available on windows
  var crypt3 = require('crypt3')
} catch(err) {
}

try {
  var fsExt = require('fs-ext')
} catch(e) {
  fsExt = {
    flock: function() {
      arguments[arguments.length-1]()
    }
  }
}

// open and flock with exponential backoff
function open_flock(name, opmod, flmod, tries, backoff, cb) {
  fs.open(name, opmod, function(err, fd) {
    if (err) return cb(err, fd)

    fsExt.flock(fd, flmod, function(err) {
      if (err) {
        if (!tries) {
          fs.close(fd, function() {
            cb(err)
          })
        } else {
          fs.close(fd, function() {
            setTimeout(function() {
              open_flock(name, opmod, flmod, tries-1, backoff*2, cb)
            }, backoff)
          })
        }
      } else {
        cb(null, fd)
      }
    })
  })
}

// this function neither unlocks file nor closes it
// it'll have to be done manually later
function lock_and_read(name, _callback) {
  open_flock(name, 'r', 'exnb', 4, 10, function(err, fd) {
    function callback(err) {
      if (err && fd) {
        fs.close(fd, function(err2) {
          _callback(err)
        })
      } else {
        _callback.apply(null, arguments)
      }
    }

    if (err) return callback(err, fd)

    fs.fstat(fd, function(err, st) {
      if (err) return callback(err, fd)

      var buffer = new Buffer(st.size)
      if (st.size === 0) return onRead(null, 0, buffer)
      fs.read(fd, buffer, 0, st.size, null, onRead)

      function onRead(err, bytesRead, buffer) {
        if (err) return callback(err, fd)
        if (bytesRead != st.size) return callback(new Error('st.size != bytesRead'), fd)

        callback(null, fd, buffer)
      }
    })
  })
}

function parse_htpasswd(input) {
  var result = {}
  input.split('\n').forEach(function(line) {
    var args = line.split(':', 3)
    if (args.length > 1) result[args[0]] = args[1]
  })
  return result
}

function verify_password(user, passwd, hash) {
  if (hash.indexOf('{PLAIN}') === 0) {
    return passwd === hash.substr(7)
  } else if (hash.indexOf('{SHA}') === 0) {
    return crypto.createHash('sha1').update(passwd, 'binary').digest('base64') === hash.substr(5)
  } else if (crypt3) {
    return crypt3(passwd, hash) === hash
  } else {
    return false
  }
}

function add_user_to_htpasswd(body, user, passwd) {
  if (user != encodeURIComponent(user)) {
    var err = Error("username shouldn't contain non-uri-safe characters")
    err.status = 409
    throw err
  }

  if (crypt3) {
    passwd = crypt3(passwd)
  } else {
    passwd = '{SHA}' + crypto.createHash('sha1').update(passwd, 'binary').digest('base64')
  }
  var comment = 'autocreated ' + (new Date()).toJSON()

  var newline = user + ':' + passwd + ':' + comment + '\n'
  if (body.length && body[body.length-1] != '\n') newline = '\n' + newline
  return body + newline
}

module.exports.parse_htpasswd = parse_htpasswd
module.exports.verify_password = verify_password
module.exports.add_user_to_htpasswd = add_user_to_htpasswd
module.exports.lock_and_read = lock_and_read
