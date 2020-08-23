"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lockAndRead = lockAndRead;
exports.parseHTPasswd = parseHTPasswd;
exports.verifyPassword = verifyPassword;
exports.addUserToHTPasswd = addUserToHTPasswd;
exports.sanityCheck = sanityCheck;
exports.getCryptoPassword = getCryptoPassword;
exports.changePasswordToHTPasswd = changePasswordToHTPasswd;

var _crypto = _interopRequireDefault(require("crypto"));

var _apacheMd = _interopRequireDefault(require("apache-md5"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _fileLocking = require("@verdaccio/file-locking");

var _crypt = _interopRequireDefault(require("./crypt3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this function neither unlocks file nor closes it
// it'll have to be done manually later
function lockAndRead(name, cb) {
  (0, _fileLocking.readFile)(name, {
    lock: true
  }, (err, res) => {
    if (err) {
      return cb(err);
    }

    return cb(null, res);
  });
}
/**
 * parseHTPasswd - convert htpasswd lines to object.
 * @param {string} input
 * @returns {object}
 */


function parseHTPasswd(input) {
  return input.split('\n').reduce((result, line) => {
    const args = line.split(':', 3);

    if (args.length > 1) {
      result[args[0]] = args[1];
    }

    return result;
  }, {});
}
/**
 * verifyPassword - matches password and it's hash.
 * @param {string} passwd
 * @param {string} hash
 * @returns {boolean}
 */


function verifyPassword(passwd, hash) {
  if (hash.match(/^\$2(a|b|y)\$/)) {
    return _bcryptjs.default.compareSync(passwd, hash);
  } else if (hash.indexOf('{PLAIN}') === 0) {
    return passwd === hash.substr(7);
  } else if (hash.indexOf('{SHA}') === 0) {
    return _crypto.default.createHash('sha1') // https://nodejs.org/api/crypto.html#crypto_hash_update_data_inputencoding
    .update(passwd, 'utf8').digest('base64') === hash.substr(5);
  } // for backwards compatibility, first check md5 then check crypt3


  return (0, _apacheMd.default)(passwd, hash) === hash || (0, _crypt.default)(passwd, hash) === hash;
}
/**
 * addUserToHTPasswd - Generate a htpasswd format for .htpasswd
 * @param {string} body
 * @param {string} user
 * @param {string} passwd
 * @returns {string}
 */


function addUserToHTPasswd(body, user, passwd) {
  if (user !== encodeURIComponent(user)) {
    const err = (0, _httpErrors.default)('username should not contain non-uri-safe characters');
    err.status = 409;
    throw err;
  }

  if (_crypt.default) {
    passwd = (0, _crypt.default)(passwd);
  } else {
    passwd = '{SHA}' + _crypto.default.createHash('sha1').update(passwd, 'utf8').digest('base64');
  }

  const comment = 'autocreated ' + new Date().toJSON();
  let newline = `${user}:${passwd}:${comment}\n`;

  if (body.length && body[body.length - 1] !== '\n') {
    newline = '\n' + newline;
  }

  return body + newline;
}
/**
 * Sanity check for a user
 * @param {string} user
 * @param {object} users
 * @param {number} maxUsers
 * @returns {object}
 */


function sanityCheck(user, password, verifyFn, users, maxUsers) {
  let err; // check for user or password

  if (!user || !password) {
    err = Error('username and password is required');
    err.status = 400;
    return err;
  }

  const hash = users[user];

  if (maxUsers < 0) {
    err = Error('user registration disabled');
    err.status = 409;
    return err;
  }

  if (hash) {
    const auth = verifyFn(password, users[user]);

    if (auth) {
      err = Error('username is already registered');
      err.status = 409;
      return err;
    }

    err = Error('unauthorized access');
    err.status = 401;
    return err;
  } else if (Object.keys(users).length >= maxUsers) {
    err = Error('maximum amount of users reached');
    err.status = 403;
    return err;
  }

  return null;
}

function getCryptoPassword(password) {
  return `{SHA}${_crypto.default.createHash('sha1').update(password, 'utf8').digest('base64')}`;
}
/**
 * changePasswordToHTPasswd - change password for existing user
 * @param {string} body
 * @param {string} user
 * @param {string} passwd
 * @param {string} newPasswd
 * @returns {string}
 */


function changePasswordToHTPasswd(body, user, passwd, newPasswd) {
  let lines = body.split('\n');
  lines = lines.map(line => {
    const [username, password] = line.split(':', 3);

    if (username === user) {
      let _passwd;

      let _newPasswd;

      if (_crypt.default) {
        _passwd = (0, _crypt.default)(passwd, password);
        _newPasswd = (0, _crypt.default)(newPasswd);
      } else {
        _passwd = getCryptoPassword(passwd);
        _newPasswd = getCryptoPassword(newPasswd);
      }

      if (password == _passwd) {
        // replace old password hash with new password hash
        line = line.replace(_passwd, _newPasswd);
      } else {
        throw new Error('Invalid old Password');
      }
    }

    return line;
  });
  return lines.join('\n');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy50cyJdLCJuYW1lcyI6WyJsb2NrQW5kUmVhZCIsIm5hbWUiLCJjYiIsImxvY2siLCJlcnIiLCJyZXMiLCJwYXJzZUhUUGFzc3dkIiwiaW5wdXQiLCJzcGxpdCIsInJlZHVjZSIsInJlc3VsdCIsImxpbmUiLCJhcmdzIiwibGVuZ3RoIiwidmVyaWZ5UGFzc3dvcmQiLCJwYXNzd2QiLCJoYXNoIiwibWF0Y2giLCJiY3J5cHQiLCJjb21wYXJlU3luYyIsImluZGV4T2YiLCJzdWJzdHIiLCJjcnlwdG8iLCJjcmVhdGVIYXNoIiwidXBkYXRlIiwiZGlnZXN0IiwiYWRkVXNlclRvSFRQYXNzd2QiLCJib2R5IiwidXNlciIsImVuY29kZVVSSUNvbXBvbmVudCIsInN0YXR1cyIsImNyeXB0MyIsImNvbW1lbnQiLCJEYXRlIiwidG9KU09OIiwibmV3bGluZSIsInNhbml0eUNoZWNrIiwicGFzc3dvcmQiLCJ2ZXJpZnlGbiIsInVzZXJzIiwibWF4VXNlcnMiLCJFcnJvciIsImF1dGgiLCJPYmplY3QiLCJrZXlzIiwiZ2V0Q3J5cHRvUGFzc3dvcmQiLCJjaGFuZ2VQYXNzd29yZFRvSFRQYXNzd2QiLCJuZXdQYXNzd2QiLCJsaW5lcyIsIm1hcCIsInVzZXJuYW1lIiwiX3Bhc3N3ZCIsIl9uZXdQYXNzd2QiLCJyZXBsYWNlIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOzs7O0FBRUE7QUFDQTtBQUNPLFNBQVNBLFdBQVQsQ0FBcUJDLElBQXJCLEVBQW1DQyxFQUFuQyxFQUF1RDtBQUM1RCw2QkFBU0QsSUFBVCxFQUFlO0FBQUVFLElBQUFBLElBQUksRUFBRTtBQUFSLEdBQWYsRUFBK0IsQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEtBQWM7QUFDM0MsUUFBSUQsR0FBSixFQUFTO0FBQ1AsYUFBT0YsRUFBRSxDQUFDRSxHQUFELENBQVQ7QUFDRDs7QUFFRCxXQUFPRixFQUFFLENB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LEtBQUosQ0FBVSxzQkFBVixDQUFOO0FBQ0Q7QUFDRjs7QUFDRCxXQUFPOUIsSUFBUDtBQUNELEdBdEJPLENBQVI7QUF3QkEsU0FBT3FDLEtBQUssQ0FBQ00sSUFBTixDQUFXLElBQVgsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuXG5pbXBvcnQgbWQ1IGZyb20gJ2FwYWNoZS1tZDUnO1xuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcyc7XG5pbXBvcnQgY3JlYXRlRXJyb3IsIHsgSHR0cEVycm9yIH0gZnJvbSAnaHR0cC1lcnJvcnMnO1xuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tICdAdmVyZGFjY2lvL2ZpbGUtbG9ja2luZyc7XG5pbXBvcnQgeyBDYWxsYmFjayB9IGZyb20gJ0B2ZXJkYWNjaW8vdHlwZXMnO1xuXG5pbXBvcnQgY3J5cHQzIGZyb20gJy4vY3J5cHQzJztcblxuLy8gdGhpcyBmdW5jdGlvbiBuZWl0aGVyIHVubG9ja3MgZmlsZSBub3IgY2xvc2VzIGl0XG4vLyBpdCdsbCBoYXZlIHRvIGJlIGRvbmUgbWFudWFsbHkgbGF0ZXJcbmV4cG9ydCBmdW5jdGlvbiBsb2NrQW5kUmVhZChuYW1lOiBzdHJpbmcsIGNiOiBDYWxsYmFjayk6IHZvaWQge1xuICByZWFkRmlsZShuYW1lLCB7IGxvY2s6IHRydWUgfSwgKGVyciwgcmVzKSA9PiB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNiKG51bGwsIHJlcyk7XG4gIH0pO1xufVxuXG4vKipcbiAqIHBhcnNlSFRQYXNzd2QgLSBjb252ZXJ0IGh0cGFzc3dkIGxpbmVzIHRvIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSFRQYXNzd2QoaW5wdXQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICByZXR1cm4gaW5wdXQuc3BsaXQoJ1xcbicpLnJlZHVjZSgocmVzdWx0LCBsaW5lKSA9PiB7XG4gICAgY29uc3QgYXJncyA9IGxpbmUuc3BsaXQoJzonLCAzKTtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAxKSB7XG4gICAgICByZXN1bHRbYXJnc1swXV0gPSBhcmdzWzFdO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LCB7fSk7XG59XG5cbi8qKlxuICogdmVyaWZ5UGFzc3dvcmQgLSBtYXRjaGVzIHBhc3N3b3JkIGFuZCBpdCdzIGhhc2guXG4gKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dkXG4gKiBAcGFyYW0ge3N0cmluZ30gaGFzaFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlQYXNzd29yZChwYXNzd2Q6IHN0cmluZywgaGFzaDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmIChoYXNoLm1hdGNoKC9eXFwkMihhfGJ8eSlcXCQvKSkge1xuICAgIHJldHVybiBiY3J5cHQuY29tcGFyZVN5bmMocGFzc3dkLCBoYXNoKTtcbiAgfSBlbHNlIGlmIChoYXNoLmluZGV4T2YoJ3tQTEFJTn0nKSA9PT0gMCkge1xuICAgIHJldHVybiBwYXNzd2QgPT09IGhhc2guc3Vic3RyKDcpO1xuICB9IGVsc2UgaWYgKGhhc2guaW5kZXhPZigne1NIQX0nKSA9PT0gMCkge1xuICAgIHJldHVybiAoXG4gICAgICBjcnlwdG9cbiAgICAgICAgLmNyZWF0ZUhhc2goJ3NoYTEnKVxuICAgICAgICAvLyBodHRwczovL25vZGVqcy5vcmcvYXBpL2NyeXB0by5odG1sI2NyeXB0b19oYXNoX3VwZGF0ZV9kYXRhX2lucHV0ZW5jb2RpbmdcbiAgICAgICAgLnVwZGF0ZShwYXNzd2QsICd1dGY4JylcbiAgICAgICAgLmRpZ2VzdCgnYmFzZTY0JykgPT09IGhhc2guc3Vic3RyKDUpXG4gICAgKTtcbiAgfVxuICAvLyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIGZpcnN0IGNoZWNrIG1kNSB0aGVuIGNoZWNrIGNyeXB0M1xuICByZXR1cm4gbWQ1KHBhc3N3ZCwgaGFzaCkgPT09IGhhc2ggfHwgY3J5cHQzKHBhc3N3ZCwgaGFzaCkgPT09IGhhc2g7XG59XG5cbi8qKlxuICogYWRkVXNlclRvSFRQYXNzd2QgLSBHZW5lcmF0ZSBhIGh0cGFzc3dkIGZvcm1hdCBmb3IgLmh0cGFzc3dkXG4gKiBAcGFyYW0ge3N0cmluZ30gYm9keVxuICogQHBhcmFtIHtzdHJpbmd9IHVzZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd2RcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRVc2VyVG9IVFBhc3N3ZChib2R5OiBzdHJpbmcsIHVzZXI6IHN0cmluZywgcGFzc3dkOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAodXNlciAhPT0gZW5jb2RlVVJJQ29tcG9uZW50KHVzZXIpKSB7XG4gICAgY29uc3QgZXJyID0gY3JlYXRlRXJyb3IoJ3VzZXJuYW1lIHNob3VsZCBub3QgY29udGFpbiBub24tdXJpLXNhZmUgY2hhcmFjdGVycycpO1xuXG4gICAgZXJyLnN0YXR1cyA9IDQwOTtcbiAgICB0aHJvdyBlcnI7XG4gIH1cblxuICBpZiAoY3J5cHQzKSB7XG4gICAgcGFzc3dkID0gY3J5cHQzKHBhc3N3ZCk7XG4gIH0gZWxzZSB7XG4gICAgcGFzc3dkID1cbiAgICAgICd7U0hBfScgK1xuICAgICAgY3J5cHRvXG4gICAgICAgIC5jcmVhdGVIYXNoKCdzaGExJylcbiAgICAgICAgLnVwZGF0ZShwYXNzd2QsICd1dGY4JylcbiAgICAgICAgLmRpZ2VzdCgnYmFzZTY0Jyk7XG4gIH1cbiAgY29uc3QgY29tbWVudCA9ICdhdXRvY3JlYXRlZCAnICsgbmV3IERhdGUoKS50b0pTT04oKTtcbiAgbGV0IG5ld2xpbmUgPSBgJHt1c2VyfToke3Bhc3N3ZH06JHtjb21tZW50fVxcbmA7XG5cbiAgaWYgKGJvZHkubGVuZ3RoICYmIGJvZHlbYm9keS5sZW5ndGggLSAxXSAhPT0gJ1xcbicpIHtcbiAgICBuZXdsaW5lID0gJ1xcbicgKyBuZXdsaW5lO1xuICB9XG4gIHJldHVybiBib2R5ICsgbmV3bGluZTtcbn1cblxuLyoqXG4gKiBTYW5pdHkgY2hlY2sgZm9yIGEgdXNlclxuICogQHBhcmFtIHtzdHJpbmd9IHVzZXJcbiAqIEBwYXJhbSB7b2JqZWN0fSB1c2Vyc1xuICogQHBhcmFtIHtudW1iZXJ9IG1heFVzZXJzXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXR5Q2hlY2soXG4gIHVzZXI6IHN0cmluZyxcbiAgcGFzc3dvcmQ6IHN0cmluZyxcbiAgdmVyaWZ5Rm46IENhbGxiYWNrLFxuICB1c2Vyczoge30sXG4gIG1heFVzZXJzOiBudW1iZXJcbik6IEh0dHBFcnJvciB8IG51bGwge1xuICBsZXQgZXJyO1xuXG4gIC8vIGNoZWNrIGZvciB1c2VyIG9yIHBhc3N3b3JkXG4gIGlmICghdXNlciB8fCAhcGFzc3dvcmQpIHtcbiAgICBlcnIgPSBFcnJvcigndXNlcm5hbWUgYW5kIHBhc3N3b3JkIGlzIHJlcXVpcmVkJyk7XG4gICAgZXJyLnN0YXR1cyA9IDQwMDtcbiAgICByZXR1cm4gZXJyO1xuICB9XG5cbiAgY29uc3QgaGFzaCA9IHVzZXJzW3VzZXJdO1xuXG4gIGlmIChtYXhVc2VycyA8IDApIHtcbiAgICBlcnIgPSBFcnJvcigndXNlciByZWdpc3RyYXRpb24gZGlzYWJsZWQnKTtcbiAgICBlcnIuc3RhdHVzID0gNDA5O1xuICAgIHJldHVybiBlcnI7XG4gIH1cblxuICBpZiAoaGFzaCkge1xuICAgIGNvbnN0IGF1dGggPSB2ZXJpZnlGbihwYXNzd29yZCwgdXNlcnNbdXNlcl0pO1xuICAgIGlmIChhdXRoKSB7XG4gICAgICBlcnIgPSBFcnJvcigndXNlcm5hbWUgaXMgYWxyZWFkeSByZWdpc3RlcmVkJyk7XG4gICAgICBlcnIuc3RhdHVzID0gNDA5O1xuICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gICAgZXJyID0gRXJyb3IoJ3VuYXV0aG9yaXplZCBhY2Nlc3MnKTtcbiAgICBlcnIuc3RhdHVzID0gNDAxO1xuICAgIHJldHVybiBlcnI7XG4gIH0gZWxzZSBpZiAoT2JqZWN0LmtleXModXNlcnMpLmxlbmd0aCA+PSBtYXhVc2Vycykge1xuICAgIGVyciA9IEVycm9yKCdtYXhpbXVtIGFtb3VudCBvZiB1c2VycyByZWFjaGVkJyk7XG4gICAgZXJyLnN0YXR1cyA9IDQwMztcbiAgICByZXR1cm4gZXJyO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDcnlwdG9QYXNzd29yZChwYXNzd29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGB7U0hBfSR7Y3J5cHRvXG4gICAgLmNyZWF0ZUhhc2goJ3NoYTEnKVxuICAgIC51cGRhdGUocGFzc3dvcmQsICd1dGY4JylcbiAgICAuZGlnZXN0KCdiYXNlNjQnKX1gO1xufVxuXG4vKipcbiAqIGNoYW5nZVBhc3N3b3JkVG9IVFBhc3N3ZCAtIGNoYW5nZSBwYXNzd29yZCBmb3IgZXhpc3RpbmcgdXNlclxuICogQHBhcmFtIHtzdHJpbmd9IGJvZHlcbiAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyXG4gKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dkXG4gKiBAcGFyYW0ge3N0cmluZ30gbmV3UGFzc3dkXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlUGFzc3dvcmRUb0hUUGFzc3dkKGJvZHk6IHN0cmluZywgdXNlcjogc3RyaW5nLCBwYXNzd2Q6IHN0cmluZywgbmV3UGFzc3dkOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgbGluZXMgPSBib2R5LnNwbGl0KCdcXG4nKTtcbiAgbGluZXMgPSBsaW5lcy5tYXAobGluZSA9PiB7XG4gICAgY29uc3QgW3VzZXJuYW1lLCBwYXNzd29yZF0gPSBsaW5lLnNwbGl0KCc6JywgMyk7XG5cbiAgICBpZiAodXNlcm5hbWUgPT09IHVzZXIpIHtcbiAgICAgIGxldCBfcGFzc3dkO1xuICAgICAgbGV0IF9uZXdQYXNzd2Q7XG4gICAgICBpZiAoY3J5cHQzKSB7XG4gICAgICAgIF9wYXNzd2QgPSBjcnlwdDMocGFzc3dkLCBwYXNzd29yZCk7XG4gICAgICAgIF9uZXdQYXNzd2QgPSBjcnlwdDMobmV3UGFzc3dkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9wYXNzd2QgPSBnZXRDcnlwdG9QYXNzd29yZChwYXNzd2QpO1xuICAgICAgICBfbmV3UGFzc3dkID0gZ2V0Q3J5cHRvUGFzc3dvcmQobmV3UGFzc3dkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhc3N3b3JkID09IF9wYXNzd2QpIHtcbiAgICAgICAgLy8gcmVwbGFjZSBvbGQgcGFzc3dvcmQgaGFzaCB3aXRoIG5ldyBwYXNzd29yZCBoYXNoXG4gICAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoX3Bhc3N3ZCwgX25ld1Bhc3N3ZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgb2xkIFBhc3N3b3JkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsaW5lO1xuICB9KTtcblxuICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG59XG4iXX0=