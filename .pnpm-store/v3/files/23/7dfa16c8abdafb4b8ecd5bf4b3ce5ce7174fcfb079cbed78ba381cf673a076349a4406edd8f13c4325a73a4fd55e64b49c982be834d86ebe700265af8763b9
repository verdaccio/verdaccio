'use strict';

var chai = require('chai');
var expect = chai.expect;
var es = require('event-stream');
var addStream = require('../');

describe('add-stream', function () {
	function emit(chunks) {
		var mutableChunks = [].concat(chunks);
		return es.readable(function (count, callback) {
			if (mutableChunks.length === 0) {
				return this.emit('end');
			}
			callback(null, mutableChunks.shift());
		});
	}

	describe('buffer mode', function () {
		it('should append a stream', function (done) {
			var firstChunks = ['abc', 'def'];
			var secondChunks = ['ghi', 'jkl'];
			emit(firstChunks)
				.pipe(addStream(emit(secondChunks)))
				.pipe(es.wait(function (err, buffer) {
					expect(buffer.toString()).to.equal(firstChunks.concat(secondChunks).join(''));
					done();
				}));
		});

		it('should append a stream from a factory function', function (done) {
			var firstChunks = ['abc', 'def'];
			var secondChunks = ['ghi', 'jkl'];
			emit(firstChunks)
				.pipe(addStream(function () {
					return emit(secondChunks);
				}))
				.pipe(es.wait(function (err, buffer) {
					expect(buffer.toString()).to.equal(firstChunks.concat(secondChunks).join(''));
					done();
				}));
		});
	});

	describe('object mode', function () {
		it('should append a stream', function (done) {
			es.readArray([{p: 1}, {p: 2}, {p: 3}])
				.pipe(addStream.obj(es.readArray([{p: 4}, {p: 5}, {p: 6}])))
				.pipe(es.writeArray(function (err, array) {
					expect(array).to.eql([{p: 1}, {p: 2}, {p: 3}, {p: 4}, {p: 5}, {p: 6}]);
					done();
				}));
		});

		it('should append a stream from a factory function', function (done) {
			es.readArray([{p: 1}, {p: 2}, {p: 3}])
				.pipe(addStream.obj(function () {return es.readArray([{p: 4}, {p: 5}, {p: 6}])}))
				.pipe(es.writeArray(function (err, array) {
					expect(array).to.eql([{p: 1}, {p: 2}, {p: 3}, {p: 4}, {p: 5}, {p: 6}]);
					done();
				}));
		});
	});
});
