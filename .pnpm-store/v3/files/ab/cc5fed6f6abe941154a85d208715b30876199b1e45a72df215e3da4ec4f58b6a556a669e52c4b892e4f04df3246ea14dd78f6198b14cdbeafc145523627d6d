/*
 * Copyright 2018 Rob Hoelz <rob AT hoelz.ro>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

var MutableIndex = function (attrs) {
  lunr.Index.call(this, attrs)
  this.builder = attrs.builder
  this._dirty = false
}

MutableIndex.prototype = new lunr.Index({})

MutableIndex.prototype.add = function add (doc) {
  this.builder.add(doc)
  this._dirty = true
}

MutableIndex.prototype.update = function update (doc) {
  this.remove(doc)
  this.add(doc)
}

MutableIndex.prototype.remove = function remove (doc) {
  this.builder.remove(doc)
  this._dirty = true
}

// XXX rebuilds the entire index =(
// XXX refreshing this from newIndex is kinda wonky =(
MutableIndex.prototype.checkDirty = function checkDirty () {
  if (this._dirty) {
    this._dirty = false
    var newIndex = this.builder.build()
    for (var k in newIndex) {
      if (newIndex.hasOwnProperty(k)) {
        this[k] = newIndex[k]
      }
    }
  }
}

MutableIndex.prototype.toJSON = function toJSON () {
  this.checkDirty()

  // XXX do you need to serialize things that we could calculate post-load via builder.build?
  var json = lunr.Index.prototype.toJSON.call(this)
  json.builder = this.builder.toJSON()
  return json
}

MutableIndex.load = function load (serializedIndex) {
  var index = lunr.Index.load(serializedIndex)
  var mutableIndex = new MutableIndex({})

  for (var k in index) {
    if (index.hasOwnProperty(k)) {
      mutableIndex[k] = index[k]
    }
  }

  mutableIndex.builder = MutableBuilder.load(serializedIndex.builder)
  mutableIndex.builder.invertedIndex = mutableIndex.invertedIndex
  mutableIndex.builder.searchPipeline = mutableIndex.pipeline
  mutableIndex.dirty = false

  return mutableIndex
}

MutableIndex.prototype.query = function query (fn) {
  this.checkDirty()

  return lunr.Index.prototype.query.call(this, fn)
}
