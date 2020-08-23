import { closeSync, createReadStream, createWriteStream, exists, existsSync, fchmodSync, fchownSync, fstatSync, fsyncSync, ftruncateSync, futimesSync, open, openSync, readFileSync, readSync, readdir, readdirSync, stat, statSync, symlink, symlinkSync, writeFileSync } from 'graceful-fs';
import * as fs from 'graceful-fs';
import { dirname, resolve, sep } from 'path';
import mkdirp from 'mkdirp';
import { readdir as readdir$1, readdirSync as readdirSync$1, stat as stat$1, statSync as statSync$1 } from 'fs';
import * as fs$1 from 'fs';
import _rimraf from 'rimraf';

function resolvePath ( args ) {
	return resolve.apply( null, args );
}

function normaliseArguments ( args ) {
	var len = args.length;

	var buildingPath = true;
	var pathargs = [];
	var normalised = [ null ]; // null is a placeholder for the resolved path
	var i;

	for ( i = 0; i < len; i += 1 ) {
		if ( buildingPath && typeof args[i] === 'string' ) {
			pathargs[i] = args[i];
		} else {
			buildingPath = false;
			normalised.push( args[i] );
		}
	}

	normalised[0] = resolvePath( pathargs );

	return normalised;
}

function asyncMethod ( methodName ) {
	return function () {
		var args = normaliseArguments( arguments );

		return new Promise( function ( fulfil, reject ) {
			args.push( function ( err, result ) {
				if ( err ) {
					reject( err );
				} else {
					fulfil( result );
				}
			});

			fs[ methodName ].apply( fs, args );
		});
	};
}

function syncMethod ( methodName ) {
	return function () {
		var args = normaliseArguments( arguments );
		return fs[ methodName ].apply( fs, args );
	};
}

function asyncFileDescriptorMethod ( methodName ) {
	return function () {
		var arguments$1 = arguments;

		var args = [];
		var i = arguments.length;

		while ( i-- ) {
			args[i] = arguments$1[i];
		}

		return new Promise( function ( fulfil, reject ) {
			args.push( function ( err, result ) {
				if ( err ) {
					reject( err );
				} else {
					fulfil( result );
				}
			});

			fs[ methodName ].apply( fs, args );
		});
	};
}

function resolvePathAndOptions ( args ) {
	var options;
	var pathargs;

	if ( typeof args[ args.length - 1 ] === 'object' ) {
		options = args[ args.length - 1 ];

		var i = args.length - 1;
		pathargs = new Array( i );

		while ( i-- ) {
			pathargs[i] = args[i];
		}
	} else {
		options = {};
		pathargs = args;
	}

	var resolvedPath = resolve.apply( null, pathargs );

	return { options: options, resolvedPath: resolvedPath };
}

function createReadStream$1 () {
	var ref = resolvePathAndOptions( arguments );
	var resolvedPath = ref.resolvedPath;
	var options = ref.options;
	return createReadStream( resolvedPath, options );
}

function createWriteStream$1 () {
	var ref = resolvePathAndOptions( arguments );
	var resolvedPath = ref.resolvedPath;
	var options = ref.options;

	mkdirp.sync( dirname( resolvedPath ) );
	return createWriteStream( resolvedPath, options );
}

function exists$1 () {
	var target = resolvePath( arguments );

	return new Promise( function (fulfil) {
		exists( target, function (exists$$1) { return fulfil( exists$$1 ); } );
	});
}

function existsSync$1 () {
	return existsSync( resolvePath( arguments ) );
}

var rename = asyncMethod$1( 'rename' );
var link = asyncMethod$1( 'link' );

var renameSync = syncMethod$1( 'renameSync' );
var linkSync = syncMethod$1( 'linkSync' );

function asyncMethod$1 ( methodName ) {
	return function () {
		var src = resolvePath( arguments );

		return {
			to: function to () {
				var dest = resolvePath( arguments );

				return new Promise( function ( fulfil, reject ) {
					mkdirp( dirname( dest ), function (err) {
						if ( err ) {
							reject( err );
						} else {
							fs[ methodName ]( src, dest, function (err) {
								if ( err ) {
									reject( err );
								} else {
									fulfil();
								}
							});
						}
					});
				});
			}
		};
	};
}

function syncMethod$1 ( methodName ) {
	return function () {
		var src = resolvePath( arguments );

		return {
			to: function to () {
				var dest = resolvePath( arguments );

				mkdirp.sync( dirname( dest ) );
				return fs[ methodName ]( src, dest );
			}
		};
	};
}

function mkdir () {
	var dir = resolvePath( arguments );

	return new Promise( function ( fulfil, reject ) {
		mkdirp( dir, function (err) {
			if ( err ) {
				reject( err );
			} else {
				fulfil();
			}
		});
	});
}

function mkdirSync () {
	var dir = resolvePath( arguments );
	mkdirp.sync( dir );
}

function normaliseArguments$1 ( args ) {
	var options;
	var flags;
	var i;

	if ( typeof args[ args.length - 1 ] === 'object' ) {
		options = args[ args.length - 1 ];
		flags = args[ args.length - 2 ];
		i = args.length - 2;
	} else {
		options = {};
		flags = args[ args.length - 1 ];
		i = args.length - 1;
	}

	var pathargs = new Array( i );
	while ( i-- ) {
		pathargs[i] = args[i];
	}

	var resolvedPath = resolvePath( pathargs );

	return { resolvedPath: resolvedPath, options: options, flags: flags };
}

function bailIfExists ( src, flags, mode ) {
	var alreadyExists;

	try {
		statSync( src );
		alreadyExists = true;
	} catch ( err ) {
		if ( err.code !== 'ENOENT' ) {
			throw err;
		}
	}

	if ( alreadyExists ) {
		// attempt the operation = that way, we get the intended error message
		// TODO can't we just do this in the first place?
		openSync( src, flags, mode );
	}
}

function open$1 () {
	var ref = normaliseArguments$1( arguments );
	var src = ref.resolvedPath;
	var options = ref.options;
	var flags = ref.flags;

	if ( /^.x/.test( flags ) ) {
		bailIfExists( src, flags, options.mode );
	}

	return new Promise( function ( fulfil, reject ) {
		function open$$1 () {
			open( src, flags, options.mode, function ( err, fd ) {
				if ( err ) {
					reject( err );
				} else {
					fulfil( fd );
				}
			});
		}

		// create dirs if necessary
		if ( /^[wa]/.test( flags ) ) {
			mkdirp( dirname( src ), function (err) {
				if ( err ) {
					reject( err );
				} else {
					open$$1();
				}
			});
		} else {
			open$$1();
		}
	});
}


function openSync$1 () {
	var ref = normaliseArguments$1( arguments );
	var src = ref.resolvedPath;
	var options = ref.options;
	var flags = ref.flags;

	if ( /^.x/.test( flags ) ) {
		bailIfExists( src, flags, options.mode );
	}

	// create dirs if necessary
	if ( /^[wa]/.test( flags ) ) {
		mkdirp.sync( dirname( src ) );
	}

	return openSync( src, flags, options.mode );
}

function symlink$1 () {
	var src = resolvePath( arguments );

	return {
		to: function to () {
			var ref = resolvePathAndOptions( arguments );
			var options = ref.options;
			var dest = ref.resolvedPath;

			return new Promise( function ( fulfil, reject ) {
				mkdirp( dirname( dest ), function (err) {
					if ( err ) {
						reject( err );
					} else {
						symlink( src, dest, options.type, function (err) {
							if ( err ) {
								reject( err );
							} else {
								fulfil();
							}
						});
					}
				});
			});
		}
	};
}

function symlinkSync$1 () {
	var src = resolvePath( arguments );

	return {
		to: function to () {
			var ref = resolvePathAndOptions( arguments );
			var options = ref.options;
			var dest = ref.resolvedPath;
			mkdirp.sync( dirname( dest ) );
			return symlinkSync( src, dest, options.type );
		}
	};
}

var writeFile = asyncMethod$2( 'writeFile' );
var appendFile = asyncMethod$2( 'appendFile' );

var writeFileSync$1 = syncMethod$2( 'writeFileSync' );
var appendFileSync = syncMethod$2( 'appendFileSync' );

function normaliseArguments$2 ( args ) {
	args = Array.prototype.slice.call( args, 0 );
	var opts = {};

	if ( typeof args[ args.length - 1 ] === 'object' && !( args[ args.length - 1 ] instanceof Buffer ) ) {
		opts = args.pop();
	}

	return { opts: opts, data: args.pop(), dest: resolvePath( args ) };
}

function asyncMethod$2 ( methodName ) {
	return function () {
		var ref = normaliseArguments$2( arguments );
		var dest = ref.dest;
		var data = ref.data;
		var opts = ref.opts;

		return new Promise( function ( fulfil, reject ) {
			mkdirp( dirname( dest ), function (err) {
				if ( err ) {
					reject( err );
				} else {
					fs[ methodName ]( dest, data, opts, function (err) {
						if ( err ) {
							reject( err );
						} else {
							fulfil( data );
						}
					});
				}
			});
		});
	};
}

function syncMethod$2 ( methodName ) {
	return function () {
		var ref = normaliseArguments$2( arguments );
		var dest = ref.dest;
		var data = ref.data;

		mkdirp.sync( dirname( dest ) );
		return fs[ methodName ]( dest, data );
	};
}

function copydir () {
	var ref = resolvePathAndOptions( arguments );
	var src = ref.resolvedPath;
	var readOptions = ref.options;

	return {
		to: function to () {
			var ref = resolvePathAndOptions( arguments );
			var dest = ref.resolvedPath;
			var writeOptions = ref.options;

			function copydir ( src, dest, cb ) {
				mkdirp( dest, function (err) {
					if ( err ) { return cb( err ); }

					readdir( src, function ( err, files ) {
						if ( err ) { return cb( err ); }

						var remaining = files.length;

						if ( !remaining ) { return cb(); }

						function check ( err ) {
							if ( err ) {
								return cb( err );
							}

							if ( !--remaining ) {
								cb();
							}
						}

						files.forEach( function ( filename ) {
							var srcpath = src + sep + filename;
							var destpath = dest + sep + filename;

							stat( srcpath, function ( err, stats ) {
								if ( err ) {
									return cb( err );
								}

								var readStream, writeStream;

								if ( stats.isDirectory() ) {
									return copydir( srcpath, destpath, check );
								}

								readStream = createReadStream( srcpath, readOptions );
								writeStream = createWriteStream( destpath, writeOptions );

								readStream.on( 'error', cb );
								writeStream.on( 'error', cb );

								writeStream.on( 'close', check );

								readStream.pipe( writeStream );
							});
						});
					});
				});
			}

			return new Promise( function ( fulfil, reject ) {
				copydir( src, dest, function (err) {
					if ( err ) {
						reject( err );
					} else {
						fulfil();
					}
				});
			});
		}
	};
}

function copydirSync () {
	var ref = resolvePathAndOptions( arguments );
	var src = ref.resolvedPath;
	var readOptions = ref.options;

	return {
		to: function to () {
			var ref = resolvePathAndOptions( arguments );
			var dest = ref.resolvedPath;
			var writeOptions = ref.options;

			function copydir ( src, dest ) {
				mkdirp.sync( dest );

				readdirSync( src ).forEach( function (filename) {
					var srcpath = src + sep + filename;
					var destpath = dest + sep + filename;

					if ( statSync( srcpath ).isDirectory() ) {
						return copydir( srcpath, destpath );
					}

					var data = readFileSync( srcpath, readOptions );
					writeFileSync( destpath, data, writeOptions );
				});
			}

			copydir( src, dest );
		}
	};
}

function copyFile () {
	var ref = resolvePathAndOptions( arguments );
	var src = ref.resolvedPath;
	var readOptions = ref.options;

	return {
		to: function to () {
			var ref = resolvePathAndOptions( arguments );
			var dest = ref.resolvedPath;
			var writeOptions = ref.options;

			return new Promise( function ( fulfil, reject ) {
				mkdirp( dirname( dest ), function (err) {
					if ( err ) {
						reject( err );
					} else {
						var readStream = createReadStream( src, readOptions );
						var writeStream = createWriteStream( dest, writeOptions );

						readStream.on( 'error', reject );
						writeStream.on( 'error', reject );

						writeStream.on( 'close', fulfil );

						readStream.pipe( writeStream );
					}
				});
			});
		}
	};
}

function copyFileSync () {
	var ref = resolvePathAndOptions( arguments );
	var src = ref.resolvedPath;
	var readOptions = ref.options;

	return {
		to: function to () {
			var ref = resolvePathAndOptions( arguments );
			var dest = ref.resolvedPath;
			var writeOptions = ref.options;

			var data = readFileSync( src, readOptions );

			mkdirp.sync( dirname( dest ) );
			writeFileSync( dest, data, writeOptions );
		}
	};
}

function walk ( dir, callback ) {
	var results = [];

	readdir$1( dir, function ( err, files ) {
		if ( err ) { return callback( err ); }

		var pending = files.length;
		if ( !pending ) { return callback( null, results ); }

		files.forEach( function (file) {
			file = resolve( dir, file );

			stat$1( file, function ( err, stats ) {
				if ( stats && stats.isDirectory() ) {
					walk( file, function ( err, res ) {
						results = results.concat( res );
						if ( !--pending ) { callback( null, results ); }
					});
				} else {
					results.push( file );
					if ( !--pending ) { callback( null, results ); }
				}
			});
		});
	});
}

function lsr () {
	var basedir = resolvePath( arguments );

	return new Promise( function ( fulfil, reject ) {
		walk( basedir, function ( err, result ) {
			if ( err ) { return reject( err ); }

			// files should be relative to basedir
			var index = basedir.length + 1;
			var i = result.length;
			while ( i-- ) {
				result[i] = result[i].substring( index );
			}

			fulfil( result );
		});
	});
}

function lsrSync () {
	var basedir = resolvePath( arguments );

	var result = [];

	function processdir ( dir ) {
		readdirSync$1( dir ).forEach( function (file) {
			var filepath = dir + sep + file;

			if ( statSync$1( filepath ).isDirectory() ) {
				processdir( filepath );
			} else {
				result.push( filepath.replace( basedir + sep, '' ) );
			}
		});
	}

	processdir( basedir );
	return result;
}

function rimraf () {
	var target = resolvePath( arguments );

	return new Promise( function ( fulfil, reject ) {
		_rimraf( target, function (err) {
			if ( err ) {
				reject( err );
			} else {
				fulfil();
			}
		});
	});
}

function rimrafSync () {
	_rimraf.sync( resolvePath( arguments ) );
}

var isWindows = process.platform === 'win32';

function symlinkOrCopy$$1 () {
	var arguments$1 = arguments;

	if ( isWindows ) {
		var ref = resolvePathAndOptions( arguments );
		var src = ref.resolvedPath;
		var readOptions = ref.options;

		var copyDirOrFileTo = stat$2( src )
			.then( function (stats) {
				return ( stats.isDirectory() ? copydir : copyFile )
					.apply( null, arguments$1 )
					.to;
			});

		return {
			to: function to () {
				var arguments$1 = arguments;

				return copyDirOrFileTo
					.then(function (fn) {
						return fn.apply(null, arguments$1);
					});
			}
		};
	}

	return symlink$1.apply( null, arguments );
}

function symlinkOrCopySync$$1 () {
	if ( isWindows ) {
		var ref = resolvePathAndOptions( arguments );
		var src = ref.resolvedPath;
		var readOptions = ref.options;
		return ( statSync$2( src ).isDirectory() ? copydirSync : copyFileSync ).apply( null, arguments );
	}

	return symlinkSync$1.apply( null, arguments );
}

// standard async methods
var chmod = asyncMethod( 'chmod' );
var chown = asyncMethod( 'chown' );
var lchmod = asyncMethod( 'lchmod' );
var lchown = asyncMethod( 'lchown' );
var lstat = asyncMethod( 'lstat' );
var readdir$2 = asyncMethod( 'readdir' );
var readFile = asyncMethod( 'readFile' );
var readlink = asyncMethod( 'readlink' );
var realpath = asyncMethod( 'realpath' );
var rmdir = asyncMethod( 'rmdir' );
var stat$2 = asyncMethod( 'stat' );
var truncate = asyncMethod( 'truncate' );
var unlink = asyncMethod( 'unlink' );
var utimes = asyncMethod( 'utimes' );
var unwatchFile = asyncMethod( 'unwatchFile' );
var watch = asyncMethod( 'watch' );
var watchFile = asyncMethod( 'watchFile' );

// standard sync methods
var chmodSync = syncMethod( 'chmodSync' );
var chownSync = syncMethod( 'chownSync' );
var lchmodSync = syncMethod( 'lchmodSync' );
var lchownSync = syncMethod( 'lchownSync' );
var lstatSync = syncMethod( 'lstatSync' );
var readdirSync$2 = syncMethod( 'readdirSync' );
var readFileSync$1 = syncMethod( 'readFileSync' );
var readlinkSync = syncMethod( 'readlinkSync' );
var realpathSync = syncMethod( 'realpathSync' );
var rmdirSync = syncMethod( 'rmdirSync' );
var statSync$2 = syncMethod( 'statSync' );
var truncateSync = syncMethod( 'truncateSync' );
var unlinkSync = syncMethod( 'unlinkSync' );
var utimesSync = syncMethod( 'utimesSync' );

// file descriptor async methods
var close = asyncFileDescriptorMethod( 'close' );
var fchmod = asyncFileDescriptorMethod( 'fchmod' );
var fchown = asyncFileDescriptorMethod( 'fchown' );
var fstat = asyncFileDescriptorMethod( 'fstat' );
var fsync = asyncFileDescriptorMethod( 'fsync' );
var ftruncate = asyncFileDescriptorMethod( 'ftruncate' );
var futimes = asyncFileDescriptorMethod( 'futimes' );
var read = asyncFileDescriptorMethod( 'read' );

// file descriptor sync methods
var closeSync$1 = closeSync;
var fchmodSync$1 = fchmodSync;
var fchownSync$1 = fchownSync;
var fstatSync$1 = fstatSync;
var fsyncSync$1 = fsyncSync;
var ftruncateSync$1 = ftruncateSync;
var futimesSync$1 = futimesSync;
var readSync$1 = readSync;

export { chmod, chown, lchmod, lchown, lstat, readdir$2 as readdir, readFile, readlink, realpath, rmdir, stat$2 as stat, truncate, unlink, utimes, unwatchFile, watch, watchFile, chmodSync, chownSync, lchmodSync, lchownSync, lstatSync, readdirSync$2 as readdirSync, readFileSync$1 as readFileSync, readlinkSync, realpathSync, rmdirSync, statSync$2 as statSync, truncateSync, unlinkSync, utimesSync, close, fchmod, fchown, fstat, fsync, ftruncate, futimes, read, closeSync$1 as closeSync, fchmodSync$1 as fchmodSync, fchownSync$1 as fchownSync, fstatSync$1 as fstatSync, fsyncSync$1 as fsyncSync, ftruncateSync$1 as ftruncateSync, futimesSync$1 as futimesSync, readSync$1 as readSync, createReadStream$1 as createReadStream, createWriteStream$1 as createWriteStream, exists$1 as exists, existsSync$1 as existsSync, link, linkSync, rename, renameSync, mkdir, mkdirSync, open$1 as open, openSync$1 as openSync, symlink$1 as symlink, symlinkSync$1 as symlinkSync, writeFile, writeFileSync$1 as writeFileSync, appendFile, appendFileSync, copydir, copydirSync, copyFile, copyFileSync, lsr, lsrSync, rimraf, rimrafSync, symlinkOrCopy$$1 as symlinkOrCopy, symlinkOrCopySync$$1 as symlinkOrCopySync };
//# sourceMappingURL=sander.es.js.map
