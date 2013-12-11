var async = require('async')

// 
// Function performs a certain task on a multiple uplinks
// and reverts changes if something fails
//
// uplinks - list of uplinks not counting local
// localAction, localRollback - function(cb)
// remoteAction, remoteRollback - function(uplink, cb)
//
module.exports = function(uplinks, localAction, localRollback, remoteAction, remoteRollback, callback) {
	var uplink_ids = uplinks.map(function(_, i) {
		return i
	})

	// localAction is first for the two reasons:
	// 1. local error is much faster to detect, so we won't bother uplinks in these cases
	// 2. we can handle looping cases correctly this way
	localAction(function(err) {
		if (err) {
			err.uplink = 'local'
			return callback(err)
		}
		async.map(uplink_ids, function(i, cb) {
			remoteAction(uplinks[i], function(err) {
				cb(null, err)
			})
		}, function(err, res) {
			var return_err = err

			// let err be first non-null element in the array
			for (var i=0; i<res.length; i++) {
				if (return_err) break
				if (res[i]) {
					return_err = res[i]
					return_err.uplink = i
				}
			}

			if (!return_err) return callback()

			async.map(uplink_ids, function(i, cb) {
				if (res[i]) return cb()
				remoteRollback(uplinks[i], function() {
					cb()
				})
			}, function(err) {
				localRollback(function() {
					callback(return_err)
				})
			})
		})
	})
}

