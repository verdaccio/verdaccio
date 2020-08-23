"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _fileLocking = require("@verdaccio/file-locking");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * HTPasswd - Verdaccio auth class
 */
class HTPasswd {
  /**
   *
   * @param {*} config htpasswd file
   * @param {object} stuff config.yaml in object from
   */
  // constructor
  constructor(config, stuff) {
    _defineProperty(this, "users", void 0);

    _defineProperty(this, "stuff", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "verdaccioConfig", void 0);

    _defineProperty(this, "maxUsers", void 0);

    _defineProperty(this, "path", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "lastTime", void 0);

    this.users = {}; // config for this module

    this.config = config;
    this.stuff = stuff; // verdaccio logger

    this.logger = stuff.logger; // verdaccio main config object

    this.verdaccioConfig = stuff.config; // all this "verdaccio_config" stuff is for b/w compatibility only

    this.maxUsers = config.max_users ? config.max_users : Infinity;
    this.lastTime = null;
    const {
      file
    } = config;

    if (!file) {
      throw new Error('should specify "file" in config');
    }

    this.path = _path.default.resolve(_path.default.dirname(this.verdaccioConfig.self_path), file);
  }
  /**
   * authenticate - Authenticate user.
   * @param {string} user
   * @param {string} password
   * @param {function} cd
   * @returns {function}
   */


  authenticate(user, password, cb) {
    this.reload(err => {
      if (err) {
        return cb(err.code === 'ENOENT' ? null : err);
      }

      if (!this.users[user]) {
        return cb(null, false);
      }

      if (!(0, _utils.verifyPassword)(password, this.users[user])) {
        return cb(null, false);
      } // authentication succeeded!
      // return all usergroups this user has access to;
      // (this particular package has no concept of usergroups, so just return
      // user herself)


      return cb(null, [user]);
    });
  }
  /**
   * Add user
   * 1. lock file for writing (other processes can still read)
   * 2. reload .htpasswd
   * 3. write new data into .htpasswd.tmp
   * 4. move .htpasswd.tmp to .htpasswd
   * 5. reload .htpasswd
   * 6. unlock file
   *
   * @param {string} user
   * @param {string} password
   * @param {function} realCb
   * @returns {function}
   */


  adduser(user, password, realCb) {
    const pathPass = this.path;
    let sanity = (0, _utils.sanityCheck)(user, password, _utils.verifyPassword, this.users, this.maxUsers); // preliminary checks, just to ensure that file won't be reloaded if it's
    // not needed

    if (sanity) {
      return realCb(sanity, false);
    }

    (0, _utils.lockAndRead)(pathPass, (err, res) => {
      let locked = false; // callback that cleans up lock first

      const cb = err => {
        if (locked) {
          (0, _fileLocking.unlockFile)(pathPass, () => {
            // ignore any error from the unlock
            realCb(err, !err);
          });
        } else {
          realCb(err, !err);
        }
      };

      if (!err) {
        locked = true;
      } // ignore ENOENT errors, we'll just create .htpasswd in that case


      if (err && err.code !== 'ENOENT') {
        return cb(err);
      }

      const body = (res || '').toString('utf8');
      this.users = (0, _utils.parseHTPasswd)(body); // real checks, to prevent race conditions
      // parsing users after reading file.

      sanity = (0, _utils.sanityCheck)(user, password, _utils.verifyPassword, this.users, this.maxUsers);

      if (sanity) {
        return cb(sanity);
      }

      try {
        this._writeFile((0, _utils.addUserToHTPasswd)(body, user, password), cb);
      } catch (err) {
        return cb(err);
      }
    });
  }
  /**
   * Reload users
   * @param {function} callback
   */


  reload(callback) {
    _fs.default.stat(this.path, (err, stats) => {
      if (err) {
        return callback(err);
      }

      if (this.lastTime === stats.mtime) {
        return callback();
      }

      this.lastTime = stats.mtime;

      _fs.default.readFile(this.path, 'utf8', (err, buffer) => {
        if (err) {
          return callback(err);
        }

        Object.assign(this.users, (0, _utils.parseHTPasswd)(buffer));
        callback();
      });
    });
  }

  _stringToUt8(authentication) {
    return (authentication || '').toString();
  }

  _writeFile(body, cb) {
    _fs.default.writeFile(this.path, body, err => {
      if (err) {
        cb(err);
      } else {
        this.reload(() => {
          cb(null);
        });
      }
    });
  }
  /**
   * changePassword - change password for existing user.
   * @param {string} user
   * @param {string} password
   * @param {function} cd
   * @returns {function}
   */


  changePassword(user, password, newPassword, realCb) {
    (0, _utils.lockAndRead)(this.path, (err, res) => {
      let locked = false;
      const pathPassFile = this.path; // callback that cleans up lock first

      const cb = err => {
        if (locked) {
          (0, _fileLocking.unlockFile)(pathPassFile, () => {
            // ignore any error from the unlock
            realCb(err, !err);
          });
        } else {
          realCb(err, !err);
        }
      };

      if (!err) {
        locked = true;
      }

      if (err && err.code !== 'ENOENT') {
        return cb(err);
      }

      const body = this._stringToUt8(res);

      this.users = (0, _utils.parseHTPasswd)(body);

      if (!this.users[user]) {
        return cb(new Error('User not found'));
      }

      try {
        this._writeFile((0, _utils.changePasswordToHTPasswd)(body, user, password, newPassword), cb);
      } catch (err) {
        return cb(err);
      }
    });
  }

}

exports.default = HTPasswd;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odHBhc3N3ZC50cyJdLCJuYW1lcyI6WyJIVFBhc3N3ZCIsImNvbnN0cnVjdG9yIiwiY29uZmlnIiwic3R1ZmYiLCJ1c2VycyIsImxvZ2dlciIsInZlcmRhY2Npb0NvbmZpZyIsIm1heFVzZXJzIiwibWF4X3VzZXJzIiwiSW5maW5pdHkiLCJsYXN0VGltZSIsImZpbGUiLCJFcnJvciIsInBhdGgiLCJQYXRoIiwicmVzb2x2ZSIsImRpcm5hbWUiLCJzZWxmX3BhdGgiLCJhdXRoZW50aWNhdGUiLCJ1c2VyIiwicGFzc3dvcmQiLCJjYiIsInJlbG9hZCIsImVyciIsImNvZGUiLCJhZGR1c2VyIiwicmVhbENiIiwicGF0aFBhc3MiLCJzYW5pdHkiLCJ2ZXJpZnlQYXNzd29yZCIsInJlcyIsImxvY2tlZCIsImJvZHkiLCJ0b1N0cmluZyIsIl93cml0ZUZpbGUiLCJjYWxsYmFjayIsImZzIiwic3RhdCIsInN0YXRzIiwibXRpbWUiLCJyZWFkRmlsZSIsImJ1ZmZlciIsIk9iamVjdCIsImFzc2lnbiIsIl9zdHJpbmdUb1V0OCIsImF1dGhlbnRpY2F0aW9uIiwid3JpdGVGaWxlIiwiY2hhbmdlUGFzc3dvcmQiLCJuZXdQYXNzd29yZCIsInBhdGhQYXNzRmlsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUVBOzs7Ozs7QUFhQTs7O0FBR2UsTUFBTUEsUUFBTixDQUEwRDtBQUN2RTs7Ozs7QUFhQTtBQUNPQyxFQUFBQSxXQUFQLENBQW1CQyxNQUFuQixFQUFxQ0MsS0FBckMsRUFBZ0U7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDOUQsU0FBS0MsS0FBTCxHQUFhLEVBQWIsQ0FEOEQsQ0FHOUQ7O0FBQ0EsU0FBS0YsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsS0FBTCxHQUFhQSxLQUFiLENBTDhELENBTzlEOztBQUNBLFNBQUtFLE1BQUwsR0FBY0YsS0FBSyxDQUFDRSxNQUFw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LEdBQUcsSUFBVDtBQUNEOztBQUVELFVBQUlSLEdBQUcsSUFBSUEsR0FBRyxDQUFDQyxJQUFKLEtBQWEsUUFBeEIsRUFBa0M7QUFDaEMsZUFBT0gsRUFBRSxDQUFDRSxHQUFELENBQVQ7QUFDRDs7QUFFRCxZQUFNUyxJQUFJLEdBQUcsS0FBS1ksWUFBTCxDQUFrQmQsR0FBbEIsQ0FBYjs7QUFDQSxXQUFLMUIsS0FBTCxHQUFhLDBCQUFjNEIsSUFBZCxDQUFiOztBQUVBLFVBQUksQ0FBQyxLQUFLNUIsS0FBTCxDQUFXZSxJQUFYLENBQUwsRUFBdUI7QUFDckIsZUFBT0UsRUFBRSxDQUFDLElBQUlULEtBQUosQ0FBVSxnQkFBVixDQUFELENBQVQ7QUFDRDs7QUFFRCxVQUFJO0FBQ0YsYUFBS3NCLFVBQUwsQ0FBZ0IscUNBQXlCRixJQUF6QixFQUErQmIsSUFBL0IsRUFBcUNDLFFBQXJDLEVBQStDNEIsV0FBL0MsQ0FBaEIsRUFBNkUzQixFQUE3RTtBQUNELE9BRkQsQ0FFRSxPQUFPRSxHQUFQLEVBQVk7QUFDWixlQUFPRixFQUFFLENBQUNFLEdBQUQsQ0FBVDtBQUNEO0FBQ0YsS0FwQ0Q7QUFxQ0Q7O0FBOU5zRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgUGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHsgQ2FsbGJhY2ssIEF1dGhDb25mLCBDb25maWcsIElQbHVnaW5BdXRoIH0gZnJvbSAnQHZlcmRhY2Npby90eXBlcyc7XG5pbXBvcnQgeyB1bmxvY2tGaWxlIH0gZnJvbSAnQHZlcmRhY2Npby9maWxlLWxvY2tpbmcnO1xuXG5pbXBvcnQge1xuICB2ZXJpZnlQYXNzd29yZCxcbiAgbG9ja0FuZFJlYWQsXG4gIHBhcnNlSFRQYXNzd2QsXG4gIGFkZFVzZXJUb0hUUGFzc3dkLFxuICBjaGFuZ2VQYXNzd29yZFRvSFRQYXNzd2QsXG4gIHNhbml0eUNoZWNrLFxufSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBWZXJkYWNjaW9Db25maWdBcHAgZXh0ZW5kcyBDb25maWcge1xuICBmaWxlOiBzdHJpbmc7XG59XG5cbi8qKlxuICogSFRQYXNzd2QgLSBWZXJkYWNjaW8gYXV0aCBjbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIVFBhc3N3ZCBpbXBsZW1lbnRzIElQbHVnaW5BdXRoPFZlcmRhY2Npb0NvbmZpZ0FwcD4ge1xuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHsqfSBjb25maWcgaHRwYXNzd2QgZmlsZVxuICAgKiBAcGFyYW0ge29iamVjdH0gc3R1ZmYgY29uZmlnLnlhbWwgaW4gb2JqZWN0IGZyb21cbiAgICovXG4gIHByaXZhdGUgdXNlcnM6IHt9O1xuICBwcml2YXRlIHN0dWZmOiB7fTtcbiAgcHJpdmF0ZSBjb25maWc6IHt9O1xuICBwcml2YXRlIHZlcmRhY2Npb0NvbmZpZzogQ29uZmlnO1xuICBwcml2YXRlIG1heFVzZXJzOiBudW1iZXI7XG4gIHByaXZhdGUgcGF0aDogc3RyaW5nO1xuICBwcml2YXRlIGxvZ2dlcjoge307XG4gIHByaXZhdGUgbGFzdFRpbWU6IGFueTtcbiAgLy8gY29uc3RydWN0b3JcbiAgcHVibGljIGNvbnN0cnVjdG9yKGNvbmZpZzogQXV0aENvbmYsIHN0dWZmOiBWZXJkYWNjaW9Db25maWdBcHApIHtcbiAgICB0aGlzLnVzZXJzID0ge307XG5cbiAgICAvLyBjb25maWcgZm9yIHRoaXMgbW9kdWxlXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5zdHVmZiA9IHN0dWZmO1xuXG4gICAgLy8gdmVyZGFjY2lvIGxvZ2dlclxuICAgIHRoaXMubG9nZ2VyID0gc3R1ZmYubG9nZ2VyO1xuXG4gICAgLy8gdmVyZGFjY2lvIG1haW4gY29uZmlnIG9iamVjdFxuICAgIHRoaXMudmVyZGFjY2lvQ29uZmlnID0gc3R1ZmYuY29uZmlnO1xuXG4gICAgLy8gYWxsIHRoaXMgXCJ2ZXJkYWNjaW9fY29uZmlnXCIgc3R1ZmYgaXMgZm9yIGIvdyBjb21wYXRpYmlsaXR5IG9ubHlcbiAgICB0aGlzLm1heFVzZXJzID0gY29uZmlnLm1heF91c2VycyA/IGNvbmZpZy5tYXhfdXNlcnMgOiBJbmZpbml0eTtcblxuICAgIHRoaXMubGFzdFRpbWUgPSBudWxsO1xuXG4gICAgY29uc3QgeyBmaWxlIH0gPSBjb25maWc7XG5cbiAgICBpZiAoIWZpbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc2hvdWxkIHNwZWNpZnkgXCJmaWxlXCIgaW4gY29uZmlnJyk7XG4gICAgfVxuXG4gICAgdGhpcy5wYXRoID0gUGF0aC5yZXNvbHZlKFBhdGguZGlybmFtZSh0aGlzLnZlcmRhY2Npb0NvbmZpZy5zZWxmX3BhdGgpLCBmaWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhdXRoZW50aWNhdGUgLSBBdXRoZW50aWNhdGUgdXNlci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNkXG4gICAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAgICovXG4gIHB1YmxpYyBhdXRoZW50aWNhdGUodXNlcjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCBjYjogQ2FsbGJhY2spOiB2b2lkIHtcbiAgICB0aGlzLnJlbG9hZChlcnIgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyLmNvZGUgPT09ICdFTk9FTlQnID8gbnVsbCA6IGVycik7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMudXNlcnNbdXNlcl0pIHtcbiAgICAgICAgcmV0dXJuIGNiKG51bGwsIGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIGlmICghdmVyaWZ5UGFzc3dvcmQocGFzc3dvcmQsIHRoaXMudXNlcnNbdXNlcl0pKSB7XG4gICAgICAgIHJldHVybiBjYihudWxsLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGF1dGhlbnRpY2F0aW9uIHN1Y2NlZWRlZCFcbiAgICAgIC8vIHJldHVybiBhbGwgdXNlcmdyb3VwcyB0aGlzIHVzZXIgaGFzIGFjY2VzcyB0bztcbiAgICAgIC8vICh0aGlzIHBhcnRpY3VsYXIgcGFja2FnZSBoYXMgbm8gY29uY2VwdCBvZiB1c2VyZ3JvdXBzLCBzbyBqdXN0IHJldHVyblxuICAgICAgLy8gdXNlciBoZXJzZWxmKVxuICAgICAgcmV0dXJuIGNiKG51bGwsIFt1c2VyXSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHVzZXJcbiAgICogMS4gbG9jayBmaWxlIGZvciB3cml0aW5nIChvdGhlciBwcm9jZXNzZXMgY2FuIHN0aWxsIHJlYWQpXG4gICAqIDIuIHJlbG9hZCAuaHRwYXNzd2RcbiAgICogMy4gd3JpdGUgbmV3IGRhdGEgaW50byAuaHRwYXNzd2QudG1wXG4gICAqIDQuIG1vdmUgLmh0cGFzc3dkLnRtcCB0byAuaHRwYXNzd2RcbiAgICogNS4gcmVsb2FkIC5odHBhc3N3ZFxuICAgKiA2LiB1bmxvY2sgZmlsZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dvcmRcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gcmVhbENiXG4gICAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAgICovXG4gIHB1YmxpYyBhZGR1c2VyKHVzZXI6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgcmVhbENiOiBDYWxsYmFjayk6IGFueSB7XG4gICAgY29uc3QgcGF0aFBhc3MgPSB0aGlzLnBhdGg7XG4gICAgbGV0IHNhbml0eSA9IHNhbml0eUNoZWNrKHVzZXIsIHBhc3N3b3JkLCB2ZXJpZnlQYXNzd29yZCwgdGhpcy51c2VycywgdGhpcy5tYXhVc2Vycyk7XG5cbiAgICAvLyBwcmVsaW1pbmFyeSBjaGVja3MsIGp1c3QgdG8gZW5zdXJlIHRoYXQgZmlsZSB3b24ndCBiZSByZWxvYWRlZCBpZiBpdCdzXG4gICAgLy8gbm90IG5lZWRlZFxuICAgIGlmIChzYW5pdHkpIHtcbiAgICAgIHJldHVybiByZWFsQ2Ioc2FuaXR5LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgbG9ja0FuZFJlYWQocGF0aFBhc3MsIChlcnIsIHJlcyk6IHZvaWQgPT4ge1xuICAgICAgbGV0IGxvY2tlZCA9IGZhbHNlO1xuXG4gICAgICAvLyBjYWxsYmFjayB0aGF0IGNsZWFucyB1cCBsb2NrIGZpcnN0XG4gICAgICBjb25zdCBjYiA9IChlcnIpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKGxvY2tlZCkge1xuICAgICAgICAgIHVubG9ja0ZpbGUocGF0aFBhc3MsICgpID0+IHtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBhbnkgZXJyb3IgZnJvbSB0aGUgdW5sb2NrXG4gICAgICAgICAgICByZWFsQ2IoZXJyLCAhZXJyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWFsQ2IoZXJyLCAhZXJyKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgbG9ja2VkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gaWdub3JlIEVOT0VOVCBlcnJvcnMsIHdlJ2xsIGp1c3QgY3JlYXRlIC5odHBhc3N3ZCBpbiB0aGF0IGNhc2VcbiAgICAgIGlmIChlcnIgJiYgZXJyLmNvZGUgIT09ICdFTk9FTlQnKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfVxuICAgICAgY29uc3QgYm9keSA9IChyZXMgfHwgJycpLnRvU3RyaW5nKCd1dGY4Jyk7XG4gICAgICB0aGlzLnVzZXJzID0gcGFyc2VIVFBhc3N3ZChib2R5KTtcblxuICAgICAgLy8gcmVhbCBjaGVja3MsIHRvIHByZXZlbnQgcmFjZSBjb25kaXRpb25zXG4gICAgICAvLyBwYXJzaW5nIHVzZXJzIGFmdGVyIHJlYWRpbmcgZmlsZS5cbiAgICAgIHNhbml0eSA9IHNhbml0eUNoZWNrKHVzZXIsIHBhc3N3b3JkLCB2ZXJpZnlQYXNzd29yZCwgdGhpcy51c2VycywgdGhpcy5tYXhVc2Vycyk7XG5cbiAgICAgIGlmIChzYW5pdHkpIHtcbiAgICAgICAgcmV0dXJuIGNiKHNhbml0eSk7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuX3dyaXRlRmlsZShhZGRVc2VyVG9IVFBhc3N3ZChib2R5LCB1c2VyLCBwYXNzd29yZCksIGNiKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxvYWQgdXNlcnNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIHB1YmxpYyByZWxvYWQoY2FsbGJhY2s6IENhbGxiYWNrKTogdm9pZCB7XG4gICAgZnMuc3RhdCh0aGlzLnBhdGgsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubGFzdFRpbWUgPT09IHN0YXRzLm10aW1lKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxhc3RUaW1lID0gc3RhdHMubXRpbWU7XG5cbiAgICAgIGZzLnJlYWRGaWxlKHRoaXMucGF0aCwgJ3V0ZjgnLCAoZXJyLCBidWZmZXIpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnVzZXJzLCBwYXJzZUhUUGFzc3dkKGJ1ZmZlcikpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9zdHJpbmdUb1V0OChhdXRoZW50aWNhdGlvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gKGF1dGhlbnRpY2F0aW9uIHx8ICcnKS50b1N0cmluZygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd3JpdGVGaWxlKGJvZHk6IHN0cmluZywgY2I6IENhbGxiYWNrKTogdm9pZCB7XG4gICAgZnMud3JpdGVGaWxlKHRoaXMucGF0aCwgYm9keSwgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2IoZXJyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVsb2FkKCgpID0+IHtcbiAgICAgICAgICBjYihudWxsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY2hhbmdlUGFzc3dvcmQgLSBjaGFuZ2UgcGFzc3dvcmQgZm9yIGV4aXN0aW5nIHVzZXIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjZFxuICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gICAqL1xuICBwdWJsaWMgY2hhbmdlUGFzc3dvcmQodXNlcjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCBuZXdQYXNzd29yZDogc3RyaW5nLCByZWFsQ2I6IENhbGxiYWNrKTogdm9pZCB7XG4gICAgbG9ja0FuZFJlYWQodGhpcy5wYXRoLCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGxldCBsb2NrZWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHBhdGhQYXNzRmlsZSA9IHRoaXMucGF0aDtcblxuICAgICAgLy8gY2FsbGJhY2sgdGhhdCBjbGVhbnMgdXAgbG9jayBmaXJzdFxuICAgICAgY29uc3QgY2IgPSAoZXJyKTogdm9pZCA9PiB7XG4gICAgICAgIGlmIChsb2NrZWQpIHtcbiAgICAgICAgICB1bmxvY2tGaWxlKHBhdGhQYXNzRmlsZSwgKCkgPT4ge1xuICAgICAgICAgICAgLy8gaWdub3JlIGFueSBlcnJvciBmcm9tIHRoZSB1bmxvY2tcbiAgICAgICAgICAgIHJlYWxDYihlcnIsICFlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlYWxDYihlcnIsICFlcnIpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAoIWVycikge1xuICAgICAgICBsb2NrZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyICYmIGVyci5jb2RlICE9PSAnRU5PRU5UJykge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYm9keSA9IHRoaXMuX3N0cmluZ1RvVXQ4KHJlcyk7XG4gICAgICB0aGlzLnVzZXJzID0gcGFyc2VIVFBhc3N3ZChib2R5KTtcblxuICAgICAgaWYgKCF0aGlzLnVzZXJzW3VzZXJdKSB7XG4gICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1VzZXIgbm90IGZvdW5kJykpO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLl93cml0ZUZpbGUoY2hhbmdlUGFzc3dvcmRUb0hUUGFzc3dkKGJvZHksIHVzZXIsIHBhc3N3b3JkLCBuZXdQYXNzd29yZCksIGNiKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19