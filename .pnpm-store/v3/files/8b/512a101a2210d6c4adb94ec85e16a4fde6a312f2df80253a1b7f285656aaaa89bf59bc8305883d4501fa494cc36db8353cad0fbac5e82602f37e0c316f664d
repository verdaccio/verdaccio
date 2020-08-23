"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileStats = getFileStats;
exports.readDirectory = readDirectory;
exports.findPackages = findPackages;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFileStats(packagePath) {
  return new Promise((resolve, reject) => {
    _fs.default.stat(packagePath, (err, stats) => {
      if (_lodash.default.isNil(err) === false) {
        return reject(err);
      }

      resolve(stats);
    });
  });
}

function readDirectory(packagePath) {
  return new Promise((resolve, reject) => {
    _fs.default.readdir(packagePath, (err, scopedPackages) => {
      if (_lodash.default.isNil(err) === false) {
        return reject(err);
      }

      resolve(scopedPackages);
    });
  });
}

function hasScope(file) {
  return file.match(/^@/) !== null;
}
/* eslint-disable no-async-promise-executor */


async function findPackages(storagePath, validationHandler) {
  const listPackages = [];
  return new Promise(async (resolve, reject) => {
    try {
      const scopePath = _path.default.resolve(storagePath);

      const storageDirs = await readDirectory(scopePath);

      for (const directory of storageDirs) {
        // we check whether has 2nd level
        if (hasScope(directory)) {
          // we read directory multiple
          const scopeDirectory = _path.default.resolve(storagePath, directory);

          const scopedPackages = await readDirectory(scopeDirectory);

          for (const scopedDirName of scopedPackages) {
            if (validationHandler(scopedDirName)) {
              // we build the complete scope path
              const scopePath = _path.default.resolve(storagePath, directory, scopedDirName); // list content of such directory


              listPackages.push({
                name: `${directory}/${scopedDirName}`,
                path: scopePath
              });
            }
          }
        } else {
          // otherwise we read as single level
          if (validationHandler(directory)) {
            const scopePath = _path.default.resolve(storagePath, directory);

            listPackages.push({
              name: directory,
              path: scopePath
            });
          }
        }
      }
    } catch (error) {
      reject(error);
    }

    resolve(listPackages);
  });
}
/* eslint-enable no-async-promise-executor */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy50cyJdLCJuYW1lcyI6WyJnZXRGaWxlU3RhdHMiLCJwYWNrYWdlUGF0aCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnMiLCJzdGF0IiwiZXJyIiwic3RhdHMiLCJfIiwiaXNOaWwiLCJyZWFkRGlyZWN0b3J5IiwicmVhZGRpciIsInNjb3BlZFBhY2thZ2VzIiwiaGFzU2NvcGUiLCJmaWxlIiwibWF0Y2giLCJmaW5kUGFja2FnZXMiLCJzdG9yYWdlUGF0aCIsInZhbGlkYXRpb25IYW5kbGVyIiwibGlzdFBhY2thZ2VzIiwic2NvcGVQYXRoIiwicGF0aCIsInN0b3JhZ2VEaXJzIiwiZGlyZWN0b3J5Iiwic2NvcGVEaXJlY3RvcnkiLCJzY29wZWREaXJOYW1lIiwicHVzaCIsIm5hbWUiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7QUFFTyxTQUFTQSxZQUFULENBQXNCQyxXQUF0QixFQUE4RDtBQUNuRSxTQUFPLElBQUlDLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBMkI7QUFDNUNDLGdCQUFHQyxJQUFILENBQVFMLFdBQVIsRUFBcUIsQ0FBQ00sR0FBRCxFQUFNQyxLQUFOLEtBQWdCO0FBQ25DLFVBQUlDLGdCQUFFQyxLQUFGLENBQVFILEdBQVIsTUFBaUIsS0FBckIsRUFBNEI7QUFDMUIsZUFBT0gsTUFBTSxDQUFDRyxHQUFELENBQWI7QUFDRDs7QUFDREosTUFBQUEsT0FBTyxDQUFDSyxLQUFELENBQVA7QUFDRCxLQUxEO0FBTUQsR0FQTSxDQUFQO0FBUUQ7O0FBRU0sU0FBU0csYUFBVCxDQUF1QlYsV0FBdkIsRUFBK0Q7QUFDcEUsU0FBTyxJQUFJQyxPQUFKLENBQVksQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQTJCO0FBQzVDQyxnQkFBR08sT0FBSCxDQUFXWCxXQUFYLEVBQXdCLENBQUNNLEdBQUQsRUFBTU0sY0FBTixLQUF5QjtBQUMvQyxVQUFJSixnQkFBRUMsS0FBRixDQUFRSCxHQUFSLE1BQWlCLEtBQXJCLEVBQTRCO0FBQzFCLGVBQU9ILE1BQU0sQ0FBQ0csR0FBRCxDQUFiO0FBQ0Q7O0FBRURKLE1BQUFBLE9BQU8sQ0FBQ1UsY0FBRCxDQUFQO0FBQ0QsS0FORDtBQU9ELEdBUk0sQ0FBUDtBQVNEOztBQUVELFNBQVNDLFFBQVQsQ0FBa0JDLElBQWxCLEVBQXlDO0FBQ3ZDLFNBQU9BLElBQUksQ0FBQ0MsS0FBTCxDQUFXLElBQVgsTUFBcUIsSUFBNUI7QUFDRDtBQUVEOzs7QUFDTyxlQUFlQyxZQUFmLENBQ0xDLFdBREssRUFFTEMsaUJBRkssRUFHc0M7QUFDM0MsUUFBTUMsWUFBOEMsR0FBRyxFQUF2RDtBQUNBLFNBQU8sSUFBSWxCLE9BQUosQ0FBWSxPQUFPQyxPQUFQLEVBQWdCQyxNQUFoQixLQUEyQjtBQUM1QyxRQUFJO0FBQ0YsWUFBTWlCLFNBQVMsR0FBR0MsY0FBS25CLE9BQUwsQ0FBYWUsV0FBYixDQUFsQjs7QUFDQSxZQUFNSyxXQUFXLEdBQUcsTUFBTVosYUFBYSxDQUFDVSxTQUFELENBQXZDOztBQUNBLFdBQUssTUFBTUcsU0FBWCxJQUF3QkQsV0FBeEIsRUFBcUM7QUFDbkM7QUFDQSxZQUFJVCxRQUFRLENBQUNVLFNBQUQsQ0FBWixFQUF5QjtBQUN2QjtBQUNBLGdCQUFNQyxjQUFjLEdBQUdILGNBQUtuQixPQUFMLENBQWFlLFdBQWIsRUFBMEJNLFNBQTFCLENBQXZCOztBQUNBLGdCQUFNWCxjQUFjLEdBQUcsTUFBTUYsYUFBYSxDQUFDYyxjQUFELENBQTFDOztBQUNBLGVBQUssTUFBTUMsYUFBWCxJQUE0QmIsY0FBNUIsRUFBNEM7QUFDMUMsZ0JBQUlNLGlCQUFpQixDQUFDTyxhQUFELENBQXJCLEVBQXNDO0FBQ3BDO0FBQ0Esb0JBQU1MLFNBQVMsR0FBR0MsY0FBS25CLE9BQUwsQ0FBYWUsV0FBYixFQUEwQk0sU0FBMUIsRUFBcUNFLGFBQXJDLENBQWxCLENBRm9DLENBR3BDOzs7QUFDQU4sY0FBQUEsWUFBWSxDQUFDTyxJQUFiLENBQWtCO0FBQ2hCQyxnQkFBQUEsSUFBSSxFQUFHLEdBQUVKLFNBQVUsSUFBR0UsYUFBYyxFQURwQjtBQUVoQkosZ0JBQUFBLElBQUksRUFBRUQ7QUFGVSxlQUFsQjtBQUlEO0FBQ0Y7QUFDRixTQWZELE1BZU87QUFDTDtBQUNBLGNBQUlGLGlCQUFpQixDQUFDSyxTQUFELENBQXJCLEVBQWtDO0FBQ2hDLGtCQUFNSCxTQUFTLEdBQUdDLGNBQUtuQixPQUFMLENBQWFlLFdBQWIsRUFBMEJNLFNBQTFCLENBQWxCOztBQUNBSixZQUFBQSxZQUFZLENBQUNPLElBQWIsQ0FBa0I7QUFDaEJDLGNBQUFBLElBQUksRUFBRUosU0FEVTtBQUVoQkYsY0FBQUEsSUFBSSxFQUFFRDtBQUZVLGFBQWxCO0FBSUQ7QUFDRjtBQUNGO0FBQ0YsS0EvQkQsQ0ErQkUsT0FBT1EsS0FBUCxFQUFjO0FBQ2R6QixNQUFBQSxNQUFNLENBQUN5QixLQUFELENBQU47QUFDRDs7QUFFRDFCLElBQUFBLE9BQU8sQ0FBQ2lCLFlBQUQsQ0FBUDtBQUNELEdBckNNLENBQVA7QUFzQ0Q7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbGVTdGF0cyhwYWNrYWdlUGF0aDogc3RyaW5nKTogUHJvbWlzZTxmcy5TdGF0cz4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk6IHZvaWQgPT4ge1xuICAgIGZzLnN0YXQocGFja2FnZVBhdGgsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICBpZiAoXy5pc05pbChlcnIpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgICByZXNvbHZlKHN0YXRzKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkRGlyZWN0b3J5KHBhY2thZ2VQYXRoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KTogdm9pZCA9PiB7XG4gICAgZnMucmVhZGRpcihwYWNrYWdlUGF0aCwgKGVyciwgc2NvcGVkUGFja2FnZXMpID0+IHtcbiAgICAgIGlmIChfLmlzTmlsKGVycikgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgIH1cblxuICAgICAgcmVzb2x2ZShzY29wZWRQYWNrYWdlcyk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoYXNTY29wZShmaWxlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGZpbGUubWF0Y2goL15ALykgIT09IG51bGw7XG59XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLWFzeW5jLXByb21pc2UtZXhlY3V0b3IgKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5kUGFja2FnZXMoXG4gIHN0b3JhZ2VQYXRoOiBzdHJpbmcsXG4gIHZhbGlkYXRpb25IYW5kbGVyOiBGdW5jdGlvblxuKTogUHJvbWlzZTx7IG5hbWU6IHN0cmluZzsgcGF0aDogc3RyaW5nIH1bXT4ge1xuICBjb25zdCBsaXN0UGFja2FnZXM6IHsgbmFtZTogc3RyaW5nOyBwYXRoOiBzdHJpbmcgfVtdID0gW107XG4gIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNjb3BlUGF0aCA9IHBhdGgucmVzb2x2ZShzdG9yYWdlUGF0aCk7XG4gICAgICBjb25zdCBzdG9yYWdlRGlycyA9IGF3YWl0IHJlYWREaXJlY3Rvcnkoc2NvcGVQYXRoKTtcbiAgICAgIGZvciAoY29uc3QgZGlyZWN0b3J5IG9mIHN0b3JhZ2VEaXJzKSB7XG4gICAgICAgIC8vIHdlIGNoZWNrIHdoZXRoZXIgaGFzIDJuZCBsZXZlbFxuICAgICAgICBpZiAoaGFzU2NvcGUoZGlyZWN0b3J5KSkge1xuICAgICAgICAgIC8vIHdlIHJlYWQgZGlyZWN0b3J5IG11bHRpcGxlXG4gICAgICAgICAgY29uc3Qgc2NvcGVEaXJlY3RvcnkgPSBwYXRoLnJlc29sdmUoc3RvcmFnZVBhdGgsIGRpcmVjdG9yeSk7XG4gICAgICAgICAgY29uc3Qgc2NvcGVkUGFja2FnZXMgPSBhd2FpdCByZWFkRGlyZWN0b3J5KHNjb3BlRGlyZWN0b3J5KTtcbiAgICAgICAgICBmb3IgKGNvbnN0IHNjb3BlZERpck5hbWUgb2Ygc2NvcGVkUGFja2FnZXMpIHtcbiAgICAgICAgICAgIGlmICh2YWxpZGF0aW9uSGFuZGxlcihzY29wZWREaXJOYW1lKSkge1xuICAgICAgICAgICAgICAvLyB3ZSBidWlsZCB0aGUgY29tcGxldGUgc2NvcGUgcGF0aFxuICAgICAgICAgICAgICBjb25zdCBzY29wZVBhdGggPSBwYXRoLnJlc29sdmUoc3RvcmFnZVBhdGgsIGRpcmVjdG9yeSwgc2NvcGVkRGlyTmFtZSk7XG4gICAgICAgICAgICAgIC8vIGxpc3QgY29udGVudCBvZiBzdWNoIGRpcmVjdG9yeVxuICAgICAgICAgICAgICBsaXN0UGFja2FnZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogYCR7ZGlyZWN0b3J5fS8ke3Njb3BlZERpck5hbWV9YCxcbiAgICAgICAgICAgICAgICBwYXRoOiBzY29wZVBhdGgsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBvdGhlcndpc2Ugd2UgcmVhZCBhcyBzaW5nbGUgbGV2ZWxcbiAgICAgICAgICBpZiAodmFsaWRhdGlvbkhhbmRsZXIoZGlyZWN0b3J5KSkge1xuICAgICAgICAgICAgY29uc3Qgc2NvcGVQYXRoID0gcGF0aC5yZXNvbHZlKHN0b3JhZ2VQYXRoLCBkaXJlY3RvcnkpO1xuICAgICAgICAgICAgbGlzdFBhY2thZ2VzLnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiBkaXJlY3RvcnksXG4gICAgICAgICAgICAgIHBhdGg6IHNjb3BlUGF0aCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpO1xuICAgIH1cblxuICAgIHJlc29sdmUobGlzdFBhY2thZ2VzKTtcbiAgfSk7XG59XG4vKiBlc2xpbnQtZW5hYmxlIG5vLWFzeW5jLXByb21pc2UtZXhlY3V0b3IgKi9cbiJdfQ==