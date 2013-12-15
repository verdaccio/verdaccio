var transaction = require('../../lib/transaction')
var assert = require('assert')

function call_back(cb, value) {
	setTimeout(function() {
		cb(value)
	}, Math.random()*30)
}

function test(uplinks, cb) {
	var calls = []
	var local = uplinks.shift()
	transaction(
		uplinks.map(
			function(x, i) {return [i, x]}
		),
		function localAction(cb) {
			calls.push('l')
			call_back(cb, !local ? 'l' : null)
		},
		function localRollback(cb) {
			calls.push('lb')
			call_back(cb, true)
		},
		function remoteAction(remote, cb) {
			calls.push('r'+remote[0])
			call_back(cb, !remote[1] ? 'r'+remote[0] : null)
		},
		function remoteRollback(remote, cb) {
			calls.push('rb'+remote[0])
			call_back(cb, true)
		},
		function callback(err) {
			cb(err, calls)
		}
	)
}

// everything is fine
test([true, true, true, true, true], function(err, calls) {
	assert.deepEqual(err, undefined)
	assert.deepEqual(calls, [ 'l', 'r0', 'r1', 'r2', 'r3' ])
})

// local throws errors - don't call remotes
test([false, true, true, true, true], function(err, calls) {
	assert.deepEqual(err, 'l')
	assert.deepEqual(calls, ['l'])
})

// remote fails, call all rollbacks
test([true, true, true, false, true], function(err, calls) {
	assert.deepEqual(err, 'r2')
	assert.deepEqual(calls, [ 'l', 'r0', 'r1', 'r2', 'r3', 'rb0', 'rb1', 'rb3', 'lb' ])
})

// no remotes
test([true], function(err, calls) {
	assert.deepEqual(err, undefined)
	assert.deepEqual(calls, [ 'l' ])
})

// all remotes fail
test([true, false, false, false, false], function(err, calls) {
	assert.deepEqual(err, 'r0')
	assert.deepEqual(calls, [ 'l', 'r0', 'r1', 'r2', 'r3', 'lb' ])
})

// mix
test([true, true, false, true, false], function(err, calls) {
	assert.deepEqual(err, 'r1')
	assert.deepEqual(calls, [ 'l', 'r0', 'r1', 'r2', 'r3', 'rb0', 'rb2', 'lb' ])
})

