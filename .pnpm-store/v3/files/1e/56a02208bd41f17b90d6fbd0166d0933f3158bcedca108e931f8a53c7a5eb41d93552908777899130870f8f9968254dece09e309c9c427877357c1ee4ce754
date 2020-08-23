"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

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
          (0, _utils.unlockFile)(pathPass, () => {
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
          (0, _utils.unlockFile)(pathPassFile, () => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odHBhc3N3ZC50cyJdLCJuYW1lcyI6WyJIVFBhc3N3ZCIsImNvbnN0cnVjdG9yIiwiY29uZmlnIiwic3R1ZmYiLCJ1c2VycyIsImxvZ2dlciIsInZlcmRhY2Npb0NvbmZpZyIsIm1heFVzZXJzIiwibWF4X3VzZXJzIiwiSW5maW5pdHkiLCJsYXN0VGltZSIsImZpbGUiLCJFcnJvciIsInBhdGgiLCJQYXRoIiwicmVzb2x2ZSIsImRpcm5hbWUiLCJzZWxmX3BhdGgiLCJhdXRoZW50aWNhdGUiLCJ1c2VyIiwicGFzc3dvcmQiLCJjYiIsInJlbG9hZCIsImVyciIsImNvZGUiLCJhZGR1c2VyIiwicmVhbENiIiwicGF0aFBhc3MiLCJzYW5pdHkiLCJ2ZXJpZnlQYXNzd29yZCIsInJlcyIsImxvY2tlZCIsImJvZHkiLCJ0b1N0cmluZyIsIl93cml0ZUZpbGUiLCJjYWxsYmFjayIsImZzIiwic3RhdCIsInN0YXRzIiwibXRpbWUiLCJyZWFkRmlsZSIsImJ1ZmZlciIsIk9iamVjdCIsImFzc2lnbiIsIl9zdHJpbmdUb1V0OCIsImF1dGhlbnRpY2F0aW9uIiwid3JpdGVGaWxlIiwiY2hhbmdlUGFzc3dvcmQiLCJuZXdQYXNzd29yZCIsInBhdGhQYXNzRmlsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUlBOzs7Ozs7QUFjQTs7O0FBR2UsTUFBTUEsUUFBTixDQUEwRDtBQUN2RTs7Ozs7QUFhQTtBQUNPQyxFQUFBQSxXQUFQLENBQW1CQyxNQUFuQixFQUFxQ0MsS0FBckMsRUFBZ0U7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDOUQsU0FBS0MsS0FBTCxHQUFhLEVBQWIsQ0FEOEQsQ0FHOUQ7O0FBQ0EsU0FBS0YsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsS0FBTCxHQUFhQSxLQUFiLENBTDhELENBTzlEOztBQUNBLFNBQUtFLE1BQUwsR0FBY0YsS0FBSyxDQUFDRSxNQUFwQixDQVI4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SUFBVDtBQUNEOztBQUVELFVBQUlSLEdBQUcsSUFBSUEsR0FBRyxDQUFDQyxJQUFKLEtBQWEsUUFBeEIsRUFBa0M7QUFDaEMsZUFBT0gsRUFBRSxDQUFDRSxHQUFELENBQVQ7QUFDRDs7QUFFRCxZQUFNUyxJQUFJLEdBQUcsS0FBS1ksWUFBTCxDQUFrQmQsR0FBbEIsQ0FBYjs7QUFDQSxXQUFLMUIsS0FBTCxHQUFhLDBCQUFjNEIsSUFBZCxDQUFiOztBQUVBLFVBQUksQ0FBQyxLQUFLNUIsS0FBTCxDQUFXZSxJQUFYLENBQUwsRUFBdUI7QUFDckIsZUFBT0UsRUFBRSxDQUFDLElBQUlULEtBQUosQ0FBVSxnQkFBVixDQUFELENBQVQ7QUFDRDs7QUFFRCxVQUFJO0FBQ0YsYUFBS3NCLFVBQUwsQ0FBZ0IscUNBQXlCRixJQUF6QixFQUErQmIsSUFBL0IsRUFBcUNDLFFBQXJDLEVBQStDNEIsV0FBL0MsQ0FBaEIsRUFBNkUzQixFQUE3RTtBQUNELE9BRkQsQ0FFRSxPQUFPRSxHQUFQLEVBQVk7QUFDWixlQUFPRixFQUFFLENBQUNFLEdBQUQsQ0FBVDtBQUNEO0FBQ0YsS0FwQ0Q7QUFxQ0Q7O0FBOU5zRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgUGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHsgQ2FsbGJhY2ssIEF1dGhDb25mLCBDb25maWcsIElQbHVnaW5BdXRoIH0gZnJvbSAnQHZlcmRhY2Npby90eXBlcyc7XG5cbmltcG9ydCB7XG4gIHZlcmlmeVBhc3N3b3JkLFxuICBsb2NrQW5kUmVhZCxcbiAgdW5sb2NrRmlsZSxcbiAgcGFyc2VIVFBhc3N3ZCxcbiAgYWRkVXNlclRvSFRQYXNzd2QsXG4gIGNoYW5nZVBhc3N3b3JkVG9IVFBhc3N3ZCxcbiAgc2FuaXR5Q2hlY2ssXG59IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFZlcmRhY2Npb0NvbmZpZ0FwcCBleHRlbmRzIENvbmZpZyB7XG4gIGZpbGU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBIVFBhc3N3ZCAtIFZlcmRhY2NpbyBhdXRoIGNsYXNzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhUUGFzc3dkIGltcGxlbWVudHMgSVBsdWdpbkF1dGg8VmVyZGFjY2lvQ29uZmlnQXBwPiB7XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGNvbmZpZyBodHBhc3N3ZCBmaWxlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzdHVmZiBjb25maWcueWFtbCBpbiBvYmplY3QgZnJvbVxuICAgKi9cbiAgcHJpdmF0ZSB1c2Vyczoge307XG4gIHByaXZhdGUgc3R1ZmY6IHt9O1xuICBwcml2YXRlIGNvbmZpZzoge307XG4gIHByaXZhdGUgdmVyZGFjY2lvQ29uZmlnOiBDb25maWc7XG4gIHByaXZhdGUgbWF4VXNlcnM6IG51bWJlcjtcbiAgcHJpdmF0ZSBwYXRoOiBzdHJpbmc7XG4gIHByaXZhdGUgbG9nZ2VyOiB7fTtcbiAgcHJpdmF0ZSBsYXN0VGltZTogYW55O1xuICAvLyBjb25zdHJ1Y3RvclxuICBwdWJsaWMgY29uc3RydWN0b3IoY29uZmlnOiBBdXRoQ29uZiwgc3R1ZmY6IFZlcmRhY2Npb0NvbmZpZ0FwcCkge1xuICAgIHRoaXMudXNlcnMgPSB7fTtcblxuICAgIC8vIGNvbmZpZyBmb3IgdGhpcyBtb2R1bGVcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnN0dWZmID0gc3R1ZmY7XG5cbiAgICAvLyB2ZXJkYWNjaW8gbG9nZ2VyXG4gICAgdGhpcy5sb2dnZXIgPSBzdHVmZi5sb2dnZXI7XG5cbiAgICAvLyB2ZXJkYWNjaW8gbWFpbiBjb25maWcgb2JqZWN0XG4gICAgdGhpcy52ZXJkYWNjaW9Db25maWcgPSBzdHVmZi5jb25maWc7XG5cbiAgICAvLyBhbGwgdGhpcyBcInZlcmRhY2Npb19jb25maWdcIiBzdHVmZiBpcyBmb3IgYi93IGNvbXBhdGliaWxpdHkgb25seVxuICAgIHRoaXMubWF4VXNlcnMgPSBjb25maWcubWF4X3VzZXJzID8gY29uZmlnLm1heF91c2VycyA6IEluZmluaXR5O1xuXG4gICAgdGhpcy5sYXN0VGltZSA9IG51bGw7XG5cbiAgICBjb25zdCB7IGZpbGUgfSA9IGNvbmZpZztcblxuICAgIGlmICghZmlsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzaG91bGQgc3BlY2lmeSBcImZpbGVcIiBpbiBjb25maWcnKTtcbiAgICB9XG5cbiAgICB0aGlzLnBhdGggPSBQYXRoLnJlc29sdmUoUGF0aC5kaXJuYW1lKHRoaXMudmVyZGFjY2lvQ29uZmlnLnNlbGZfcGF0aCksIGZpbGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIGF1dGhlbnRpY2F0ZSAtIEF1dGhlbnRpY2F0ZSB1c2VyLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dvcmRcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2RcbiAgICogQHJldHVybnMge2Z1bmN0aW9ufVxuICAgKi9cbiAgcHVibGljIGF1dGhlbnRpY2F0ZSh1c2VyOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIGNiOiBDYWxsYmFjayk6IHZvaWQge1xuICAgIHRoaXMucmVsb2FkKGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIuY29kZSA9PT0gJ0VOT0VOVCcgPyBudWxsIDogZXJyKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy51c2Vyc1t1c2VyXSkge1xuICAgICAgICByZXR1cm4gY2IobnVsbCwgZmFsc2UpO1xuICAgICAgfVxuICAgICAgaWYgKCF2ZXJpZnlQYXNzd29yZChwYXNzd29yZCwgdGhpcy51c2Vyc1t1c2VyXSkpIHtcbiAgICAgICAgcmV0dXJuIGNiKG51bGwsIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgLy8gYXV0aGVudGljYXRpb24gc3VjY2VlZGVkIVxuICAgICAgLy8gcmV0dXJuIGFsbCB1c2VyZ3JvdXBzIHRoaXMgdXNlciBoYXMgYWNjZXNzIHRvO1xuICAgICAgLy8gKHRoaXMgcGFydGljdWxhciBwYWNrYWdlIGhhcyBubyBjb25jZXB0IG9mIHVzZXJncm91cHMsIHNvIGp1c3QgcmV0dXJuXG4gICAgICAvLyB1c2VyIGhlcnNlbGYpXG4gICAgICByZXR1cm4gY2IobnVsbCwgW3VzZXJdKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdXNlclxuICAgKiAxLiBsb2NrIGZpbGUgZm9yIHdyaXRpbmcgKG90aGVyIHByb2Nlc3NlcyBjYW4gc3RpbGwgcmVhZClcbiAgICogMi4gcmVsb2FkIC5odHBhc3N3ZFxuICAgKiAzLiB3cml0ZSBuZXcgZGF0YSBpbnRvIC5odHBhc3N3ZC50bXBcbiAgICogNC4gbW92ZSAuaHRwYXNzd2QudG1wIHRvIC5odHBhc3N3ZFxuICAgKiA1LiByZWxvYWQgLmh0cGFzc3dkXG4gICAqIDYuIHVubG9jayBmaWxlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSByZWFsQ2JcbiAgICogQHJldHVybnMge2Z1bmN0aW9ufVxuICAgKi9cbiAgcHVibGljIGFkZHVzZXIodXNlcjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCByZWFsQ2I6IENhbGxiYWNrKTogYW55IHtcbiAgICBjb25zdCBwYXRoUGFzcyA9IHRoaXMucGF0aDtcbiAgICBsZXQgc2FuaXR5ID0gc2FuaXR5Q2hlY2sodXNlciwgcGFzc3dvcmQsIHZlcmlmeVBhc3N3b3JkLCB0aGlzLnVzZXJzLCB0aGlzLm1heFVzZXJzKTtcblxuICAgIC8vIHByZWxpbWluYXJ5IGNoZWNrcywganVzdCB0byBlbnN1cmUgdGhhdCBmaWxlIHdvbid0IGJlIHJlbG9hZGVkIGlmIGl0J3NcbiAgICAvLyBub3QgbmVlZGVkXG4gICAgaWYgKHNhbml0eSkge1xuICAgICAgcmV0dXJuIHJlYWxDYihzYW5pdHksIGZhbHNlKTtcbiAgICB9XG5cbiAgICBsb2NrQW5kUmVhZChwYXRoUGFzcywgKGVyciwgcmVzKTogdm9pZCA9PiB7XG4gICAgICBsZXQgbG9ja2VkID0gZmFsc2U7XG5cbiAgICAgIC8vIGNhbGxiYWNrIHRoYXQgY2xlYW5zIHVwIGxvY2sgZmlyc3RcbiAgICAgIGNvbnN0IGNiID0gKGVycik6IHZvaWQgPT4ge1xuICAgICAgICBpZiAobG9ja2VkKSB7XG4gICAgICAgICAgdW5sb2NrRmlsZShwYXRoUGFzcywgKCkgPT4ge1xuICAgICAgICAgICAgLy8gaWdub3JlIGFueSBlcnJvciBmcm9tIHRoZSB1bmxvY2tcbiAgICAgICAgICAgIHJlYWxDYihlcnIsICFlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlYWxDYihlcnIsICFlcnIpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAoIWVycikge1xuICAgICAgICBsb2NrZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBpZ25vcmUgRU5PRU5UIGVycm9ycywgd2UnbGwganVzdCBjcmVhdGUgLmh0cGFzc3dkIGluIHRoYXQgY2FzZVxuICAgICAgaWYgKGVyciAmJiBlcnIuY29kZSAhPT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICB9XG4gICAgICBjb25zdCBib2R5ID0gKHJlcyB8fCAnJykudG9TdHJpbmcoJ3V0ZjgnKTtcbiAgICAgIHRoaXMudXNlcnMgPSBwYXJzZUhUUGFzc3dkKGJvZHkpO1xuXG4gICAgICAvLyByZWFsIGNoZWNrcywgdG8gcHJldmVudCByYWNlIGNvbmRpdGlvbnNcbiAgICAgIC8vIHBhcnNpbmcgdXNlcnMgYWZ0ZXIgcmVhZGluZyBmaWxlLlxuICAgICAgc2FuaXR5ID0gc2FuaXR5Q2hlY2sodXNlciwgcGFzc3dvcmQsIHZlcmlmeVBhc3N3b3JkLCB0aGlzLnVzZXJzLCB0aGlzLm1heFVzZXJzKTtcblxuICAgICAgaWYgKHNhbml0eSkge1xuICAgICAgICByZXR1cm4gY2Ioc2FuaXR5KTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5fd3JpdGVGaWxlKGFkZFVzZXJUb0hUUGFzc3dkKGJvZHksIHVzZXIsIHBhc3N3b3JkKSwgY2IpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbG9hZCB1c2Vyc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgcHVibGljIHJlbG9hZChjYWxsYmFjazogQ2FsbGJhY2spOiB2b2lkIHtcbiAgICBmcy5zdGF0KHRoaXMucGF0aCwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5sYXN0VGltZSA9PT0gc3RhdHMubXRpbWUpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdFRpbWUgPSBzdGF0cy5tdGltZTtcblxuICAgICAgZnMucmVhZEZpbGUodGhpcy5wYXRoLCAndXRmOCcsIChlcnIsIGJ1ZmZlcikgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMudXNlcnMsIHBhcnNlSFRQYXNzd2QoYnVmZmVyKSk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3N0cmluZ1RvVXQ4KGF1dGhlbnRpY2F0aW9uOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAoYXV0aGVudGljYXRpb24gfHwgJycpLnRvU3RyaW5nKCk7XG4gIH1cblxuICBwcml2YXRlIF93cml0ZUZpbGUoYm9keTogc3RyaW5nLCBjYjogQ2FsbGJhY2spOiB2b2lkIHtcbiAgICBmcy53cml0ZUZpbGUodGhpcy5wYXRoLCBib2R5LCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYihlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZWxvYWQoKCkgPT4ge1xuICAgICAgICAgIGNiKG51bGwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjaGFuZ2VQYXNzd29yZCAtIGNoYW5nZSBwYXNzd29yZCBmb3IgZXhpc3RpbmcgdXNlci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNkXG4gICAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAgICovXG4gIHB1YmxpYyBjaGFuZ2VQYXNzd29yZCh1c2VyOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIG5ld1Bhc3N3b3JkOiBzdHJpbmcsIHJlYWxDYjogQ2FsbGJhY2spOiB2b2lkIHtcbiAgICBsb2NrQW5kUmVhZCh0aGlzLnBhdGgsIChlcnIsIHJlcykgPT4ge1xuICAgICAgbGV0IGxvY2tlZCA9IGZhbHNlO1xuICAgICAgY29uc3QgcGF0aFBhc3NGaWxlID0gdGhpcy5wYXRoO1xuXG4gICAgICAvLyBjYWxsYmFjayB0aGF0IGNsZWFucyB1cCBsb2NrIGZpcnN0XG4gICAgICBjb25zdCBjYiA9IChlcnIpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKGxvY2tlZCkge1xuICAgICAgICAgIHVubG9ja0ZpbGUocGF0aFBhc3NGaWxlLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBpZ25vcmUgYW55IGVycm9yIGZyb20gdGhlIHVubG9ja1xuICAgICAgICAgICAgcmVhbENiKGVyciwgIWVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVhbENiKGVyciwgIWVycik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmICghZXJyKSB7XG4gICAgICAgIGxvY2tlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnIgJiYgZXJyLmNvZGUgIT09ICdFTk9FTlQnKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBib2R5ID0gdGhpcy5fc3RyaW5nVG9VdDgocmVzKTtcbiAgICAgIHRoaXMudXNlcnMgPSBwYXJzZUhUUGFzc3dkKGJvZHkpO1xuXG4gICAgICBpZiAoIXRoaXMudXNlcnNbdXNlcl0pIHtcbiAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignVXNlciBub3QgZm91bmQnKSk7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuX3dyaXRlRmlsZShjaGFuZ2VQYXNzd29yZFRvSFRQYXNzd2QoYm9keSwgdXNlciwgcGFzc3dvcmQsIG5ld1Bhc3N3b3JkKSwgY2IpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=